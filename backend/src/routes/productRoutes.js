const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/Users');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const products = await Product.find(query);
    const categorizedItems = products.reduce((accumulator, currentItem) => {
      const categoryId = currentItem.category; 

      if (!accumulator[categoryId]) {
        accumulator[categoryId] = [];
      }

      accumulator[categoryId].push(currentItem);

      return accumulator;
    }, {});
    
    if (search) {
      return res.json({ categorized: categorizedItems, flat: products });
    }
    res.json(categorizedItems);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's liked products
router.get('/favorites/list', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedProducts');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.likedProducts || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product details
router.get('/detail/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle like product
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const productId = req.params.id;
    const index = user.likedProducts.indexOf(productId);

    if (index !== -1) {
      user.likedProducts.splice(index, 1);
    } else {
      user.likedProducts.push(productId);
    }

    await user.save();
    res.json({ status: 'success', liked: index === -1, likedProducts: user.likedProducts });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
