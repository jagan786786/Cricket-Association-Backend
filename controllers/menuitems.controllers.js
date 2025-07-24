const Menuitems = require("../models/menuitems.model");

exports.createMenuItem = async (req, res) => {
    try {
        const { name, icon } = req.body;

        if (!name?.trim() || !icon?.trim()) {
            return res.status(400).json({ message: "Name and icon are required" });
        }

        const menuItem = new Menuitems({
            name: name.trim(),
            icon: icon.trim(),
        });

        await menuItem.save();
        res.status(201).json({ message: "Menu item created", menuItem });

    } catch (error) {
        res.status(500).json({ message: "Error creating menu item", error: error.message });
    }
};


exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menuitems.find();
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(500).json({ message: "Error fetching menu items", error: error.message });
    }
}

exports.updateMenuItem = async (req, res) => {
    try {
        const { name, icon } = req.body;

        const updated = await Menuitems.findByIdAndUpdate(
            req.params.id,
            { name, icon },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Menu item not found" });

        res.json({ message: "Menu item updated", menuItem: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error: error.message });
    }
};


exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menuitems.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu item", error: error.message });
  }
};
