const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

// ✅ Add Category
router.post("/", async (req, res) => {
  const { name } = req.body;
  const categories = await Category.find();
  if (categories.length >= 4) return res.status(400).json({ message: "Maximum 4 categories allowed" });

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// ✅ Delete Category + Products
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Delete all products under the category
    await Product.deleteMany({ category_id: category._id });

    // Delete the category
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category & its products deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
