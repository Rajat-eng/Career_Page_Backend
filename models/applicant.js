const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User=require('./user');

const applicantSchema=mongoose.Schema({
    job:{
        type:String
    }, 
    workexp:[
        {
            company:{
                type:String,
            },
            duration:{
                type:String
            },
            type:{
                type:String // intern or full time
            },
            designation:{
                type:String
            }
        }
    ],
    totalworkexp:{
        type:Number
    },
    skills:[{type:String}],
    profile:{
        type:String,
    },
    personalDetails:{
        dob:{
            type:String
        },
        maritalStatus:{
            type:String
        }, 
        languages:[String],
        address:{
            addressline1:{
                type:String,
            },
            district:{
                type:String
            },
            state:{
                type:String,
            },
            pincode:{
                type:Number
            },
            country:{
                type:String
            }
        },
        differentlyAbled:{
            type:String
        },
        gender:{
            type:String,
            //required:true
        },
    },
    education:[
        {
            qualification:{
                type:String,
            },
            institutionName:{
                type:String,
            },
            startYear:{
                type:String,
            },
            endYear:{
                type:String,
            },
            score:{
                type:String
            }
        }
    ],
    hasProfile:{
        type:Boolean,
        default:"false"
    },
    resume:{
        public_id:String,
        secure_url:String
    },
    links:{
        linkedIn:{
            type:String
        },
        instagram:{
            type:String
        },
        github:{
            type:String
        }
    },
    myJobs:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"Application"
        }
    ],
});

applicantSchema.pre("save",async function(next){
// Only run this function if password was moddified (not on other update functions)
    if(!this.isModified("password")){  
        next()
    }

    this.password= await bcrypt.hash(this.password,10);
})


applicantSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// applicantSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// applicantSchema.methods.getResetPasswordToken=function(){
//     const resetToken=crypto.randomBytes(20).toString("hex")

//     this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

//     this.resetPasswordExpire=Date.now()+ 15*60*1000

//     return resetToken
// }

const applicantModel=User.discriminator("Applicant",applicantSchema)

module.exports=applicantModel;

