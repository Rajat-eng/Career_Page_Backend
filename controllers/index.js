const User=require('../models/user');
const ErrorHandler=require('../utils/errorhandler');

exports.getProfile=async (req,res,next)=>{
    try {
        const user=await User.findById(req.user._id);

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    return res.status(200).json({
        success:true,
        user
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

exports.logout = async function (req, res,next) {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    return res.status(200).json({
      success: true,
      message: "Logged out Successfully",
    });
  };