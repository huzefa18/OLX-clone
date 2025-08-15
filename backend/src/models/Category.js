const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }     ,  
  img:{type:String ,required:true} ,
  href:{type:String}                           
});

module.exports = mongoose.model('Category', categorySchema);
