const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const listings = require('../data/data');

dotenv.config();

async function seedData() {
  const idx = await Product.collection.indexes();
  console.log(JSON.stringify(idx, null, 2));
  
  
  try {
    // await connectDB();
    await Category.deleteMany();
    await Product.deleteMany();
      const products={};
    for (const [key, items] of Object.entries(listings)) {
      const first = items[0];
      const category = await Category.create({
        name: first.name,
        img: first.img,
        href: `/category/${key}`,
      });
        if(!products[key]) products[key]={}
       products[key] = items.map(item => ({
        title: item.title,
        price: item.price,
        location: item.location,
        timeAgo: item.timeAgo,
        img: item.img,
        href: item.href,
        category: category._id,
      }));

      await Product.insertMany(products);
      console.log(`Inserted ${products.length} products for category "${category.name}"`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();