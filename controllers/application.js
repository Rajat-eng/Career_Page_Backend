const Application = require("../models/application");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const Applicant=require('../models/applicant');
const Job=require('../models/jobs')

exports.scheduleInterview = async function (req, res) {
  try {
    const {interviewerName,interviewTime}=req.body 
    const result=await Application.findByIdAndUpdate(req.params.id,{
      $set:{
        isScheduled:true,
        assignedTo:interviewerName,
        time:new Date(interviewTime).getTime(),
        status:"Scheduled"
      }
    },{
      new:true
    })
   
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

exports.applicationStatus=async function(req,res,next){
  
  let application=await Application.findById(req.params.id);
  if(!application){
    return (next (new ErrorHandler("Not found"),403))
  }
  application.status=req.body.status
  await application.save()
  return res.status(200).json({
    success:true,
    message:"status changed"
  })
} 

exports.getApplications = async function (req, res) {
  try {
    const resultPerpage=10;
    let apiFeature = new ApiFeatures(Application.find({isDeleted:false}), req.query).filter().pagination(resultPerpage)

    let applications = await apiFeature.query.populate([ { path: "job" }, { path: "applicant" } ]).sort({createdAt:-1})

    const applicationCount=await Applicant.countDocuments();
    
    return res.status(200).json({
      success: true,
      applications,
      resultPerpage,
      applicationCount
    });
  
  } catch (error) {
    console.log(error)
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

exports.getMyApplications=async function(req,res,next){
  try {
    const applications=await Application.find({applicant:req.user._id})

    return res.status(200).json({
      success:true,
      applications
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
 
}
