const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const Category= require('../models/Category')

router.get('/', async (req, res) => {
  try {
    const products=await Product.find();
    const categorizedItems = products.reduce((accumulator, currentItem) => {
  const categoryId = currentItem.category; 

  if (!accumulator[categoryId]) {
    accumulator[categoryId] = [];
  }

  accumulator[categoryId].push(currentItem);

  return accumulator;
}, {});
    res.json(categorizedItems)
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:categoryId', async (req, res) => {
  const {categoryId}=req.params;
  try {
    const products=await Product.find({category:categoryId});
    const category= await Category.findById(categoryId);
    // res.json({

    // })
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports=router
