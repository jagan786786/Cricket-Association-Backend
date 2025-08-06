const Membership = require("../models/Membership.model");
const Menuitems = require("../models/menuitems.model");

// Create Membership
exports.createMembership = async (req, res) => {
  try {
    const {
      menuItem,
      name,
      description,
      price,
      duration,
      features,
      isPopular = false,
      active = true,
    } = req.body;

    if (!menuItem || !name || !description || !price || !duration || !features) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const menuItemExists = await Menuitems.findById(menuItem);
    if (!menuItemExists) return res.status(404).json({ message: "Menu item not found" });

    const membership = new Membership({
      menuItem,
      name,
      description,
      price,
      duration,
      features,
      isPopular,
      active,
    });

    await membership.save();
    res.status(201).json({ message: "Membership created successfully", membership });
  } catch (error) {
    res.status(500).json({ message: "Error creating membership", error: error.message });
  }
};

// Update Membership
exports.updateMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    const {
      menuItem,
      name,
      description,
      price,
      duration,
      features,
      isPopular,
      active,
    } = req.body;

    if (menuItem) {
      const menuItemExists = await Menuitems.findById(menuItem);
      if (!menuItemExists) return res.status(404).json({ message: "Menu item not found" });
    }

    const updated = await Membership.findByIdAndUpdate(
      membershipId,
      {
        menuItem,
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

    if (!updated) return res.status(404).json({ message: "Membership not found" });

    res.json({ message: "Membership updated successfully", membership: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating membership", error: error.message });
  }
};

// Delete Membership
exports.deleteMembership = async (req, res) => {
  try {
    const deleted = await Membership.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Membership not found" });

    res.json({ message: "Membership deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting membership", error: error.message });
  }
};

// Get All Memberships
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate("menuItem", "name");
    res.json({ memberships });
  } catch (error) {
    res.status(500).json({ message: "Error fetching memberships", error: error.message });
  }
};

// Get Memberships by Menu Item
exports.getMembershipsByMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const memberships = await Membership.find({ menuItem: menuItemId }).populate("menuItem", "name");
    res.status(200).json({ memberships });
  } catch (error) {
    res.status(500).json({ message: "Error fetching by menu item", error: error.message });
  }
};

// Toggle Active Status
exports.toggleMembershipActive = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    membership.active = !membership.active;
    await membership.save();

    res.json({
      message: `Membership is now ${membership.active ? "active" : "inactive"}`,
      membership,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling active status", error: error.message });
  }
};
