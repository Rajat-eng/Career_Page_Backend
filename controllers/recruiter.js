const Recruiter = require("../models/recruiter");
const Job = require("../models/jobs");
const sendToken = require("../utils/jwt");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/user");

exports.register = async function (req, res) {
  try {
    const recruiter = await Recruiter.findOne({ empId: req.body.empId });
    if (recruiter) {
      return next(new ErrorHandler("Already registered", 403));
    }

    await Recruiter.create(req.body);

    return res.status(200).json({
      success: true,
      message: "successfully registered",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return next(new ErrorHandler("Not found", 403));
    }
    const isPasswordMatched = await recruiter.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect email or passowrd", 401));
    }

    sendToken(recruiter, 200, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Intrnal server error",
    });
  }
};


