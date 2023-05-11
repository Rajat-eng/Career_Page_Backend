const applicantModel = require("../models/applicant");
const Application = require("../models/application");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/cloudinary");
const sendToken = require("../utils/jwt");
const ErrorHandler=require('../utils/errorhandler');

exports.sendCode = async function (req, res,next) {
  const code = Math.floor(1000 + Math.random() * 9000);
  res.app.locals.token = code;
  return res.status(200).json({
    success: true,
    code,
  });
};

exports.register = async function (req, res,next) {
  try {
    
    const applicant=await applicantModel.findOne({email:req.body.email})
    
    if(applicant){
      return next(new ErrorHandler("Email already registered",403));
    }

    if (req.app.locals.token !== req.body.otp) {
      return next(new ErrorHandler("Wrong Otp",404))
    }
    
    delete req.body.otp;

    const b = await applicantModel.create(req.body);
    
    sendToken(b, 200, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async function (req, res,next) {
  try {
    const { email, otp } = req.body;

    const applicant = await applicantModel.findOne({ email });

    if (!applicant) {
      return next(new ErrorHandler("You are not registered. Sign up first",403))
    }

    if (req.app.locals.token != otp) {
      return next(new ErrorHandler("Wrong Otp",404))
    }

    sendToken(applicant, 200, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};




//update routes
exports.update = async function (req, res, next) {
  try {
    // const applicant = await applicantModel.findById(req.applicant._id);
    const { personalDetails, skills, workexp, education,resume=null,links,details} = req.body;
    // delete form cloudinary

    const parsedEducation = JSON.parse(education);
    const parsedSkills=JSON.parse(skills);
    const parsedWorkexp=JSON.parse(workexp);
    const parsedPD=JSON.parse(personalDetails);
    const parsedLinks=JSON.parse(links);
    const parsedDetails=JSON.parse(details);
    console.log(parsedDetails)
    if(resume!==null){
      const parsedResume=JSON.parse(resume);
      await applicantModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            personalDetails:parsedPD,
            skills:parsedSkills,
            workexp:parsedWorkexp,
            education: parsedEducation,
            links:parsedLinks,
            resume:parsedResume,
            firstname:parsedDetails.firstname,
            lastname:parsedDetails.lastname,
            phone:parsedDetails.phone,
          },
        },
        {
          new: true,
        }
      );
    }else{
      await applicantModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            personalDetails:parsedPD,
            skills:parsedSkills,
            workexp:parsedWorkexp,
            education: parsedEducation,
            links:parsedLinks,
            firstname:parsedDetails.firstname,
            lastname:parsedDetails.lastname,
            phone:parsedDetails.phone,
          },
        },
        {
          new: true,
        }
      );
    }

    await applicantModel.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          hasProfile:true
        }
      }
    )


    return res.status(200).json({
      success: true,
      message: "Details uploaded",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};

// applicant deletes its application
exports.deleteApplication = async function (req, res, next) {
  await Application.findByIdAndDelete(req.params.id);
  await applicantModel.updateOne(
    { _id: req.applicant._id },
    {
      $pull: {
        myJobs: req.params.id,
      },
    }
  );
};

// applicant deletes himself/herself
exports.deleteApplicant = async function (req, res,next) {
  let { id } = req.params;
  try {
    const applicant = await applicantModel.findById(id);
    if (!applicant) {
      return next(new ErrorHandler("You are not registered. Sign up first",403))
    }

    await applicant.remove();

    return res.status(200).json({
      success: true,
      message: "Job nhi chahiye ?",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};
