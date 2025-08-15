const Category = require('../models/Category');
const express= require('express')
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories=await Category.find();
    res.json(categories)
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
