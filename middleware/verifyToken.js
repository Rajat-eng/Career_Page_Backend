const jwt = require("jsonwebtoken");
const User=require('../models/user');
const ErrorHandler = require("../utils/errorhandler");


exports.isAuthenticated = (async (req, res, next) => {
  try {
    const { token } = req.cookies; // cookie parser
    // console.log(apptoken)
    if (!token) {
      return next(new ErrorHandler("Please login first", 401));
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id); 

    console.log('auth');
  
    next();
  } catch (error) {
    console.log(error);
    return res.status(500),json({
      success:false,
      message:"Internal server error"
    })
  }
});



exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // not admin
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};
