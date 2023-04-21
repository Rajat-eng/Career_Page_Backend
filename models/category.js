const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true
  },
  slug:{
    type:String,
    lowercase:true,
    trim:true,
    unique:true,
    required:true,
  }
},{
    timestamps:true,
})


module.exports=mongoose.model('Category',categorySchema);