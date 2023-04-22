const Job = require("../models/jobs");
const Application = require("../models/application");
const Applicant = require("../models/applicant");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const Category = require("../models/category");
const slugify = require("slugify");

// find a job-- filters
exports.getJob = async function (req, res, next) {
  try {
    const resultPerPage = 4;
    let filters = req.query;
    const currentPage = Number(filters && filters.page) || 1 
    const skip = resultPerPage * (currentPage - 1);
    const removeFields = ["page", "limit"];
    removeFields.forEach((key) => delete filters[key]);
    if (filters.hasOwnProperty("jobTitle")) {
      let val = filters.jobTitle;
      let obj = {
        $regex: val,
        $options: "i",
      };
      filters.jobTitle = obj;
    }

    filters = JSON.parse(
      JSON.stringify(filters).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (key) => `$${key}`
      )
    );

    let jobs = await Job.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      {
        $addFields: {
          total_Applications: {
            $size: "$applications",
          },
          scheduled: {
            $map: {
              input: {
                $filter: {
                  input: "$applications",
                  as: "application",
                  cond: "$$application.isScheduled",
                },
              },
              as: "application",
              in: { application: "$$application" },
            },
          },
          rejected: {
            $map: {
              input: {
                $filter: {
                  input: "$applications",
                  as: "application",
                  cond: { eq: ["$$application.status", "rejected"] },
                },
              },
              as: "application",
              in: { application: "$$application" },
            },
          },
          selected: {
            $map: {
              input: {
                $filter: {
                  input: "$applications",
                  as: "application",
                  cond: { eq: ["$$application.status", "selected"] },
                },
              },
              as: "application",
              in: { application: "$$application" },
            },
          },
        },
      },
      {
        $addFields: {
          total_Scheduled: {
            $size: "$scheduled",
          },
          total_Rejected: {
            $size: "$rejected",
          },
          total_Scheduled: {
            $size: "$selected",
          },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: resultPerPage,
      },
      {
        $sort:{
          createdAt:-1
        }
      },
      {
        $project: {
          applications: 0,
          scheduled: 0,
          rejected: 0,
          selected: 0,
        },
      },
    ]);

    await Category.populate(jobs, {
      path: "category",
    });

    const jobsCount = await Job.countDocuments();

    return res.status(200).json({
      success: true,
      jobs,
      jobsCount,
      resultPerPage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

exports.getSingleJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }
  return res.status(200).json({
    success: true,
    job,
  });
};

exports.applyJob = async function (req, res, next) {
  const { id } = req.params;
  try {
    const applicant = await Applicant.findById(req.user._id);
    const job = await Job.findById(id);

    if (!job) {
      return next(new ErrorHandler("Job not found", 401));
    }

    if (applicant.myJobs.includes(id)) {
      return next(new ErrorHandler("Already applied for this job", 403));
    }

    await Applicant.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { myJobs: id } },
      { new: true }
    );

    const application = await Application.create({
      applicant: req.user._id,
      job: id,
      category: job.category,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Your application is registered",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

// post a job
exports.postJob = async function (req, res) {
  try {
    console.log(req.body)
    const slug = slugify(req.body.categoryTitle, {
      lower: true,
      trim: true,
      replacement: "_",
    });

    const category = await Category.findOneAndUpdate(
      {
        slug
      },
      {
        $set: {
          title: req.body.categoryTitle,
        },
      },
      {
        new:true,
        upsert: true,
      }
    );

    const job = await Job.create({
      ...req.body,
      lastApply:new Date(req.body.lastApply).getTime(),
      category: category._id,
    });

    return res.status(200).json({
      success: true,
      job,
      message: "Job is posted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

//delete a job
exports.deleteJob = async function (req, res, next) {
  try {
    let job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return next(new ErrorHandler("Problem in deleting the job", 403));
    }
    await Application.deleteMany({ job: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Job is deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

// edit job
exports.updateJob = async function (req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(401).json({
        success: false,
        message: "job not found",
      });
    }

    const result = await Job.findByIdAndUpdate(
      id,
      {
        $set: {
          jobTitle: req.body.jobTitle,
          jd: req.body.jd,
          aboutCompany: req.body.aboutCompany,
          experience: req.body.experience,
          jobType: req.body.jobType,
          jobLocation: req.body.jobLocation,
          salary: req.body.salary,
          skills: req.body.skills,
          startingDate: req.body.startingDate,
          lastApply: new Date(req.body.lastApply),
          perks: req.body.perks,
        },
      },
      {
        new: true,
      }
    );
    console.log(result);
    return res.status(200).json({
      success: true,
      message: "job updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};
