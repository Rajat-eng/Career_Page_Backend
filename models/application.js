const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  time:{
      type:Number
  },
  assignedTo:{
    type:String
  },
  linkOfInterview:{
    type:String
  },
  isScheduled:{
    type:Boolean,
    default:false
  },
  isInterviewDone:{
    type:Boolean
  },
  status: {
    type: String,
    enum: [
      "applied",
      "shortlisted",
      "scheduled",
      "selected",
      "rejected",
    ],
    default: "applied",
    // required:true
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
}
);

module.exports = mongoose.model("Application", applicationSchema);
