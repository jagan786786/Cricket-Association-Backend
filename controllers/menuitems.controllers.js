const Menuitems = require("../models/menuitems.model");

exports.createMenuItem = async (req, res) => {
    try{
        const {name} = req.body;
        if(!name?.trim()){
            return res.status(400).json({ message: "Menu item name cannot be empty" });
        }

        const menuItem = new Menuitems({
            name: name.trim()
        });

        await menuItem.save();
        res.status(201).json({ message: "Menu item created", menuItem });

    }catch(err){
        res.status(500).json({ message: "Error creating menuitems", error: error.message });
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

exports.updateMenuItem = async(req, res) => {
    try {
        const { name } = req.body;
        const updated = await Menuitems.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Menu item not found" });
        res.json({ message: "Menu item updated", menuItem: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error: error.message });
    }
}
