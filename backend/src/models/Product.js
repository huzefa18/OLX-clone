// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  title:        { type: String, required: true, trim: true },
  price:        { type: String, required: true },               // "Rs 45000"
  location:     { type: String, required: true },
  timeAgo:      { type: String, required: true },               // "3 days ago"
  img:         { type: String, required: true },
  href:         {type:String, required:true}            ,   // "/category/mobile-phones"
  category:{type: mongoose.Schema.Types.ObjectId, ref:'Category'}  // "mobile-phones                   // "mobile-phones" (map to local image in FE)
});

module.exports = mongoose.model('Product', productSchema);
