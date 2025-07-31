const Tournament = require("../models/tournaments.model");
const Module = require("../models/module.model");
const Menuitems = require("../models/menuitems.model");
const FormSchema = require("../models/FormSchema.model");
const FormLink = require("../models/FormLink.model");
const FormField = require("../models/FormField.model");
const FieldValidation = require("../models/FieldValidation.model");

// Dynamic mapping of menu item names to corresponding models
const dynamicModelMap = {
  Services: [Module],
  Tournaments: [Tournament],
};

// Get instances by menu item ID
exports.getInstancesByMenuItem = async (req, res) => {
  const { menuItemId } = req.params;

  try {
    const menuItem = await Menuitems.findById(menuItemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });

    const models = dynamicModelMap[menuItem.name];
    if (!models || models.length === 0)
      return res
        .status(404)
        .json({ error: "No instance models mapped for this menu item" });

    const results = [];
    for (const model of models) {
      const docs = await model
        .find({ menuItem: menuItem._id, active: true })
        .select("_id name");
      results.push(...docs);
    }

    res.status(200).json({ instances: results });
  } catch (err) {
    console.error("Get Instances Error:", err);
    res.status(500).json({ error: "Server error while fetching instances" });
  }
};

// Create a new form
exports.createForm = async (req, res) => {
  try {
    const {
      name,
      description,
      fields, // Array of FormField ObjectIds
      layout,
      submitButton,
      callbackUrl,
      callbackMethod,
      menuItem,
      instanceId,
    } = req.body;

    // Validate menu and instance
    const menuItemDoc = await Menuitems.findById(menuItem);
    if (!menuItemDoc)
      return res.status(404).json({ error: "MenuItem not found" });

    const models = dynamicModelMap[menuItemDoc.name];
    if (!models || models.length === 0)
      return res
        .status(400)
        .json({ error: "Instance model not mapped for this menu" });

    const InstanceModel = models[0];
    const instanceDoc = await InstanceModel.findById(instanceId);
    if (!instanceDoc)
      return res.status(404).json({ error: "Instance not found" });

    // Create form
    const newForm = new FormSchema({
      name,
      description,
      fields,
      layout,
      submitButton,
      callbackUrl,
      callbackMethod,
    });

    const savedForm = await newForm.save();

    const formLink = new FormLink({
      formId: savedForm._id,
      menuItemName: menuItemDoc.name,
      instanceName: instanceDoc.name,
      isActive: true,
    });

    await formLink.save();

    res.status(201).json({
      message: "Form created and linked successfully.",
      form: savedForm,
      link: formLink,
    });
  } catch (error) {
    console.error("Create Form Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing form
exports.updateForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const {
      name,
      description,
      fields,
      layout,
      submitButton,
      callbackUrl,
      callbackMethod,
      menuItem,
      instanceId,
    } = req.body;

    const updatedForm = await FormSchema.findByIdAndUpdate(
      formId,
      {
        name,
        description,
        fields,
        layout,
        submitButton,
        callbackUrl,
        callbackMethod,
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) return res.status(404).json({ error: "Form not found" });

    const formLink = await FormLink.findOne({ formId });

    if (menuItem && instanceId && formLink) {
      const menuItemDoc = await Menuitems.findById(menuItem);
      if (!menuItemDoc)
        return res.status(404).json({ error: "MenuItem not found" });

      const models = dynamicModelMap[menuItemDoc.name];
      if (!models || models.length === 0)
        return res
          .status(400)
          .json({ error: "Instance model not mapped for this menu" });

      const InstanceModel = models[0];
      const instanceDoc = await InstanceModel.findById(instanceId);
      if (!instanceDoc)
        return res.status(404).json({ error: "Instance not found" });

      formLink.menuItemName = menuItemDoc.name;
      formLink.instanceName = instanceDoc.name;
      await formLink.save();
    }

    res.json({
      message: "Form and link updated successfully",
      form: updatedForm,
      link: formLink || null,
    });
  } catch (error) {
    console.error("Update Form Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Toggle active/inactive state
exports.toggleFormActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const link = await FormLink.findOneAndUpdate(
      { formId: id },
      { isActive },
      { new: true }
    );

    if (!link) return res.status(404).json({ error: "Form link not found" });

    res.json({
      message: `Form has been ${isActive ? "activated" : "deactivated"}.`,
      link,
    });
  } catch (error) {
    console.error("Toggle Form Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createValidation = async (req, res) => {
  try {
    const validation = new FieldValidation(req.body);
    const saved = await validation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Validation Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createFormField = async (req, res) => {
  try {
    const field = new FormField(req.body);
    const saved = await field.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Field Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFormFieldById = async (req, res) => {
  try {
    const field = await FormField.findById(req.params.id).populate(
      "validation"
    );
    if (!field) return res.status(404).json({ error: "Form field not found" });
    res.json(field);
  } catch (err) {
    console.error("Get Field Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await FormSchema.findById(req.params.id).populate("fields");
    if (!form) return res.status(404).json({ error: "Form not found" });

    console.log("Submit Button:", form.submitButton); // 👈 debug log

    res.json(form);
  } catch (err) {
    console.error("Get Form Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add in formController.controllers.js
exports.getAllForms = async (req, res) => {
  try {
    const forms = await FormLink.find().populate("formId");
    res.json(forms);
  } catch (error) {
    console.error("Fetch All Forms Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
