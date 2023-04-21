const Category=require('../models/category');
const ErrorHandler = require('../utils/errorhandler')
const slugify=require('slugify');


exports.createCategory=async function(req,res,next){
    try {
    const {title}=req.body
    const slug=slugify(title,{
        lower:true,
        trim:true,
        replacement:"_"
    })
    const test=await Category.findOne({slug})
    if(test){
        return next(new ErrorHandler("Category Already exists"),401);
    }
    const category=await Category.create({
        title,
        slug
    },{
        upsert:true
    })

    return res.status(200).json({
        success:true,
        message:"Category Created"
    }) 
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"Internal server error"
        })
    }
}

exports.getCategories=async function(req,res,next){

    try {
        const categories=await Category.find({});

        return res.status(200).json({
            success:true,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"Internal server error"
        })
    }
    
   
}