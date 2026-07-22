const express = require('express');
const Product  = require('../models/Product');
const User     = require('../models/Users');
const { requireAuth } = require('../middleware/requireAuth');
const upload   = require('../middleware/upload');
const router   = express.Router();

// ──────────────────────────────────────────────────────────────────────────
// GET /products
// Returns all products grouped by category; supports optional search + pagination
// ──────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };

    if (search) {
      // Return paginated flat array for search results
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [products, total] = await Promise.all([
        Product.find(query).skip(skip).limit(parseInt(limit)).sort('-createdAt'),
        Product.countDocuments(query),
      ]);
      return res.json({
        categorized: {},
        flat: products,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      });
    }

    // Return grouped by category (home page feed)
    const products = await Product.find(query);
    const categorized = products.reduce((acc, item) => {
      const cId = item.category?.toString();
      if (!acc[cId]) acc[cId] = [];
      acc[cId].push(item);
      return acc;
    }, {});
    res.json(categorized);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// GET /products/favorites/list  — logged-in user's liked products
// ──────────────────────────────────────────────────────────────────────────
router.get('/favorites/list', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedProducts');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.likedProducts || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// GET /products/my-listings  — logged-in user's own posted ads
// ──────────────────────────────────────────────────────────────────────────
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('category', 'name')
      .sort('-createdAt');
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// GET /products/detail/:id  — single product detail (populate seller + category)
// ──────────────────────────────────────────────────────────────────────────
router.get('/detail/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('seller', 'name email createdAt');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// POST /products  — create a new listing (auth required, image upload)
// ──────────────────────────────────────────────────────────────────────────
router.post('/', requireAuth, upload.single('img'), async (req, res) => {
  try {
    const { title, description, price, location, category, imgUrl } = req.body;

    // Resolve image: uploaded file takes priority, then URL field
    let img = imgUrl || '';
    if (req.file) {
      const host = `${req.protocol}://${req.get('host')}`;
      img = `${host}/uploads/${req.file.filename}`;
    }
    if (!img) return res.status(400).json({ error: 'An image is required' });

    const product = await Product.create({
      title,
      description: description || '',
      price: price.startsWith('Rs') ? price : `Rs ${price}`,
      location,
      img,
      href: '',
      category,
      seller: req.user.id,
      timeAgo: 'just now',
    });

    await product.populate(['category', { path: 'seller', select: 'name email createdAt' }]);
    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// DELETE /products/:id  — delete a listing (only the seller can delete)
// ──────────────────────────────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.seller?.toString() !== req.user.id)
      return res.status(403).json({ error: 'Forbidden: not your listing' });
    await product.deleteOne();
    res.json({ status: 'success', message: 'Listing deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// POST /products/:id/like  — toggle like on a product
// ──────────────────────────────────────────────────────────────────────────
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const productId = req.params.id;
    const index = user.likedProducts.indexOf(productId);
    if (index !== -1) user.likedProducts.splice(index, 1);
    else user.likedProducts.push(productId);
    await user.save();
    res.json({ status: 'success', liked: index === -1, likedProducts: user.likedProducts });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// GET /products/:categoryId  — products by category (paginated)
// ──────────────────────────────────────────────────────────────────────────
router.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 8 } = req.query;
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find({ category: categoryId })
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt'),
      Product.countDocuments({ category: categoryId }),
    ]);
    res.json({
      products,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
