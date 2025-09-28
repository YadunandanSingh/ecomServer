const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
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
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  subCategory: {
   type: Array,
    default:[]
  }
});

module.exports = mongoose.model('Category', CategorySchema);