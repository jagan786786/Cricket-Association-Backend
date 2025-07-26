const Tournament = require("../models/tournaments.model");
const Category = require("../models/category.model");
const Menuitems = require("../models/menuitems.model");

// Create Tournament
exports.createTournament = async (req, res) => {
  try {
    const {
      menuItem,
      category,
      name,
      description,
      date,
      format,
      teams,
      location,
      entryFee,
      prizePool,
      active = true,
      mapurl,
    } = req.body;

    if (
      !menuItem ||
      !category ||
      !name ||
      !description ||
      !date ||
      !format ||
      !teams ||
      !location ||
      !entryFee
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

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

    const tournament = new Tournament({
      menuItem,
      category,
      name,
      description,
      date,
      format,
      teams,
      location,
      entryFee,
      prizePool,
      active,
      mapurl,
    });

    await tournament.save();
    res
      .status(201)
      .json({ message: "Tournament created successfully", tournament });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating tournament", error: error.message });
  }
};

// Update Tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const {
      menuItem,
      category,
      name,
      description,
      date,
      format,
      teams,
      location,
      entryFee,
      prizePool,
      active,
      mapurl,
    } = req.body;

    if (menuItem && category) {
      const menuItemExists = await Menuitems.findById(menuItem);
      if (!menuItemExists)
        return res.status(404).json({ message: "Menu item not found" });

      const categoryExists = await Category.findById(category);
      if (!categoryExists)
        return res.status(404).json({ message: "Category not found" });

      if (categoryExists.menuItem.toString() !== menuItem)
        return res.status(400).json({
          message: "Category does not belong to the specified menu item",
        });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        menuItem,
        category,
        name,
        description,
        date,
        format,
        teams,
        location,
        entryFee,
        prizePool,
        mapurl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.json({
      message: "Tournament updated successfully",
      tournament: updatedTournament,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating tournament", error: error.message });
  }
};

// Delete Tournament
exports.deleteTournament = async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting tournament", error: error.message });
  }
};

// Get All Tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("menuItem", "name")
      .populate("category", "name");
    res.json({ tournaments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tournaments", error: error.message });
  }
};

// Get Tournaments by Category
exports.getTournamentsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const tournaments = await Tournament.find({
      category: categoryId,
      active: true,
    }).populate("category", "name");
    res.json({ tournaments });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tournaments by category",
      error: error.message,
    });
  }
};

// Get Tournaments by Menu Item
exports.getTournamentsByMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const tournaments = await Tournament.find({ menuItem: menuItemId })
      .populate("menuItem", "name")
      .populate("category", "name");

    res.status(200).json({ tournaments });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tournaments by menu item",
      error: error.message,
    });
  }
};

exports.toggleTournamentActive = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    tournament.active = !tournament.active;
    await tournament.save();

    res.json({
      message: `Tournament is now ${tournament.active ? "active" : "inactive"}`,
      tournament,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling tournament active status", error: error.message });
  }
}
