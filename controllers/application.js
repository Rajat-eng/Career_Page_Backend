const Application = require("../models/application");
const Category=require('../models/category');
const ErrorHandler = require("../utils/errorhandler");
const Applicant = require("../models/applicant");
const Job = require("../models/jobs");
const mongodb=require('mongodb');

exports.scheduleInterview = async function (req, res) {
  try {
    const { interviewerName, interviewTime } = req.body;
    const result = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isScheduled: true,
          assignedTo: interviewerName,
          time: new Date(interviewTime).getTime(),
          status: "Scheduled",
        },
      },
      {
        new: true,
      }
    );

    // send mail to applicant and interviewer
    return res.status(200).json({
      success: true,
      message: "interviwew scheduled",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

exports.applicationStatus = async function (req, res, next) {
  let application = await Application.findById(req.params.id);
  if (!application) {
    return next(new ErrorHandler("Not found"), 403);
  }
  application.status = req.body.status;
  await application.save();
  return res.status(200).json({
    success: true,
    message: "status changed",
  });
};

exports.getApplications = async function (req, res) {
  try {
    const resultPerpage = 10;
    let filters = req.query;
    //filters=JSON.parse(JSON.stringify(filters).replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`))
    console.log(filters)
    if(filters.hasOwnProperty('category')){
      let value=filters.category
      filters.category=new mongodb.ObjectId(value)
    }

    if(filters.hasOwnProperty('days')){
      let value=filters.days
      let today=new Date(Date.now());
      let myDate=new Date(today.getTime()-Number(value)*24*60*60*1000)
      filters.createdAt={$gte:myDate,$lte:today}
    }
    
    const currentPage = Number(filters && filters.page) || 1;

    const skip = resultPerpage * (currentPage - 1);

    const removeFields = ["page", "days"];

    removeFields.forEach((key) => delete filters[key]);

    let applications = await Application.aggregate([
      { $match: { ...filters,isDeleted:false } },
      {
        $facet: {
          result: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: resultPerpage,
            },
          ],
          applicationCount: [
            {
              $count: "applicationCount",
            },
          ],
        },
      },
      {
        $project: {
          result: 1,
          applicationCount: {
            $arrayElemAt: ["$applicationCount", 0],
          },
        },
      },
    ]);

    let applicationCount=0;
    if(applications[0].result.length>0){
      applicationCount=applications[0].applicationCount.applicationCount
      await Applicant.populate(applications[0].result,{path:'applicant',select:{myJobs:0}})
      await Job.populate(applications[0].result,{path:'job',select:{_id:1,jobTitle:1}})
    }

    return res.status(200).json({
      success: true,
      applications: applications[0].result,
      applicationCount
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

exports.updateApplication = async function (req, res) {
  try {
    await Application.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          salaryOffered: req.body.salary,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

exports.getMyApplications = async function (req, res, next) {
  try {
    const applications = await Application.find({ applicant: req.user._id });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};
