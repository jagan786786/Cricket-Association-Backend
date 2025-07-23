const Category = require("../models/category.model");

// Create a Category
// category.controller.js
exports.createCategory = async (req, res) => {
  try {
    const { name, menuItemId } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name cannot be empty" });
    }

    if (!menuItemId) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }

    const menuItemExists = await Menuitems.findById(menuItemId);
    if (!menuItemExists) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const activeCount = await Category.countDocuments({
      active: true,
      menuItem: menuItemId,
    });

    const category = new Category({
      name: name.trim(),
      active: activeCount < 4,
      menuItem: menuItemId,
    });

    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Update a Category Name
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// Delete a Category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted", category: deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

// Toggle Activate/Deactivate Category
exports.toggleCategoryActive = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (!category.active) {
      const activeCount = await Category.countDocuments({ active: true });
      if (activeCount >= 4) {
        return res
          .status(400)
          .json({ message: "Only 4 categories can be active at a time" });
      }
    }

    category.active = !category.active;
    await category.save();
    res.json({
      message: `Category ${category.active ? "activated" : "deactivated"}`,
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling category status",
      error: error.message,
    });
  }
};

//get categories by menu item
exports.getCategoriesByMenuItem = async (req, res) => {
  try {
    const categories = await Category.find({ menuItem: req.params.menuItemId });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};
