// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: String, required: true },         // "Rs 45000"
  location:    { type: String, required: true },
  timeAgo:     { type: String, default: 'just now' },   // "3 days ago" or computed
  img:         { type: String, required: true },
  href:        { type: String, default: '' },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
