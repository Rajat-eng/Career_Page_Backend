const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User=require('./user');

const recruiterSchema=new mongoose.Schema({
    
    empId:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

recruiterSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next()
    }

    this.password=await bcrypt.hash(this.password,10);
})

recruiterSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

recruiterSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

recruiterSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire=Date.now()+ 15*60*1000

    return resetToken
}

const Recruiter=User.discriminator("Recruiter",recruiterSchema);

module.exports=Recruiter;