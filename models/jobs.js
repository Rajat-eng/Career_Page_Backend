const mongoose=require('mongoose');

const jobSchema=new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    jobTitle:{
        type:String,
    },
    jd:{
        type:String
    },
    designation:{
        type:String
    },
    aboutCompany:{
        type:String,
    },
    experience:{
        type:String
    },
    jobType:{
        type:String,
    },
    jobLocation:{
        type:String,
    },
    salary:{
        type:Number,
    },
    skills:{
        type:Array,
    },
    vacancy:{
        type:Number,
    },
    lastApply:{
        type:Number,
    },
    perks:{
        type:Array
    }
},{
    timestamps:true,
})


module.exports=mongoose.model('Job',jobSchema);