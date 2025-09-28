const mongoose = require('mongoose');


const ProductModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    required:true
  },
  imagePath: {
    type: String,
    required: true,
  },
 
  Category: {
    type: String,
    required: true,
   
  },
  subCategory: {
   type: String,
    
  },
  price: {
   type: Number,
   required: true,
    
  },
  Discont_Price: {
   type: Number,
   required: true,
    
  },
  brand: {
   type: String,
   required: true,
    
  },
  quantity: {
   type: Number,
   required: true,
    
  },
  discription: {
   type: String,
   required: true,
    
  },
  
},{timestamps:true});

module.exports = mongoose.model('Products', ProductModel);