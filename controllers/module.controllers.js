const Module = require('../models/module.model');
const Category = require('../models/category.model');

exports.createModule = async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      price,
      duration,
      skills,
      isPopular,
    } = req.body;

    if (
      !category || !name || !description || !price ||
      !duration || !skills || skills.length < 3
    ) {
      return res.status(400).json({ message: 'Please fill all required fields and at least 3 skills' });
    }

    // Validate category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const module = new Module({
      category,
      name,
      description,
      price,
      duration,
      skills,
      isPopular,
    });

    await module.save();
    res.status(201).json({ message: 'Module created successfully', module });
  } catch (error) {
    res.status(500).json({ message: 'Error creating module', error: error.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const {
      category,
      name,
      description,
      price,
      duration,
      skills,
      isPopular,
    } = req.body;

    if (skills && (skills.length < 3 || skills.length > 5)) {
      return res.status(400).json({ message: 'Skills must contain 3–5 items' });
    }

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      {
        category,
        name,
        description,
        price,
        duration,
        skills,
        isPopular,
      },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json({ message: 'Module updated', module: updatedModule });
  } catch (error) {
    res.status(500).json({ message: 'Error updating module', error: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const deleted = await Module.findByIdAndDelete(moduleId);
    if (!deleted) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
};

exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate('category', 'name');
    res.json({ modules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error: error.message });
  }
};

exports.getModulesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const modules = await Module.find({ category: categoryId }).populate('category', 'name');
    res.json({ modules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules by category', error: error.message });
  }
};
