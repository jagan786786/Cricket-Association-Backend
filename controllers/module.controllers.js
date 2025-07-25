const mongoose = require("mongoose");
const Module = require("../models/module.model");
const Category = require("../models/category.model");
const Menuitems = require("../models/menuitems.model");

const createModule = async (req, res) => {
  const {
    menuItem,
    category,
    name,
    description,
    price,
    duration,
    features,
    isPopular,
    active = true,
  } = req.body;

  console.log("Received payload:", req.body);

  if (
    !menuItem ||
    !category ||
    !name ||
    !description ||
    !price ||
    !duration ||
    !features ||
    features.length < 3
  ) {
    return res.status(400).json({
      message:
        "Please fill all required fields and provide at least 3 features.",
    });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(menuItem)) {
      return res.status(400).json({ message: "Invalid menuItem ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const menuItemExists = await Menuitems.findById(menuItem);
    if (!menuItemExists) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newModule = new Module({
      menuItem,
      category,
      name,
      description,
      price,
      duration,
      features,
      isPopular,
      active,
    });

    const savedModule = await newModule.save();
    res.status(201).json({
      message: "Module created successfully",
      module: savedModule,
    });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const {
      menuItem,
      category,
      name,
      description,
      price,
      duration,
      features,
      isPopular,
      active,
    } = req.body;

    if (features && (features.length < 3 || features.length > 5)) {
      return res
        .status(400)
        .json({ message: "features must contain 3–5 items" });
    }

    if (menuItem && category) {
      const menuItemExists = await Menuitems.findById(menuItem);
      if (!menuItemExists) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (categoryExists.menuItem.toString() !== menuItem) {
        return res.status(400).json({
          message: "Category does not belong to the specified menu item",
        });
      }
    }

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      {
        menuItem,
        category,
        name,
        description,
        price,
        duration,
        features,
        isPopular,
        active,
      },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json({ message: "Module updated successfully", module: updatedModule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating module", error: error.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const deleted = await Module.findByIdAndDelete(moduleId);
    if (!deleted) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting module", error: error.message });
  }
};

const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("category", "name");
    res.json({ modules });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching modules", error: error.message });
  }
};

const getModulesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const modules = await Module.find({ category: categoryId }).populate(
      "category",
      "name"
    );
    res.json({ modules });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching modules by category",
      error: error.message,
    });
  }
};

const getModulesByMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;

    const modules = await Module.find({ menuItem: menuItemId })
      .populate("menuItem", "name")
      .populate("category", "name");

    res.status(200).json({ modules });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching modules by menu item",
      error: error.message,
    });
  }
};

const toggleModuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    module.active = !module.active;
    await module.save();

    res.status(200).json({
      message: `Module ${module.active ? "activated" : "deactivated"} successfully`,
      active: module.active,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling module active status",
      error: error.message,
    });
  }
};


module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getAllModules,
  getModulesByCategory,
  getModulesByMenuItem,
  toggleModuleActive,
};


