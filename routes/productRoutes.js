const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add Product
router.post("/", async (req, res) => {
  const { name, price, description, image_url, category_id } = req.body;

  if (!category_id) return res.status(400).json({ message: "Category ID is required" });

  try {
    // Ensure category exists
    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Restrict to 4 products per category
    const productCount = await Product.countDocuments({ category_id });
    if (productCount >= 4) return res.status(400).json({ message: "Maximum 4 products per category allowed" });

    // Create and save product
    const newProduct = new Product({
      name,
      price,
      description,
      image_url,
      category_id: category._id, // Ensure this is stored as an ObjectId
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
