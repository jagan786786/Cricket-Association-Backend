const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers");
const moduleController = require("../controllers/module.controllers");
const menuItemController = require("../controllers/menuitems.controllers");

// Menu Item Routes
router.get("/menuitems", menuItemController.getAllMenuItems);
router.post("/menuitem", menuItemController.createMenuItem);
router.put("/menuitem/:id", menuItemController.updateMenuItem);

// Category Routes
router.get("/categories", categoryController.getAllCategories);
router.post("/category", categoryController.createCategory);
router.put("/category/:id", categoryController.updateCategory);
router.get('/menuItem/:menuItemId', categoryController.getCategoriesByMenuItem);
router.delete("/category/:id", categoryController.deleteCategory);
router.patch("/category/:id/toggle-active", categoryController.toggleCategoryActive);

// Module Routes
router.post('/module', moduleController.createModule);
router.put('/module/:id', moduleController.updateModule);
router.delete('/module/:id', moduleController.deleteModule);
router.get('/modules', moduleController.getAllModules);
router.get('/modules/category/:categoryId', moduleController.getModulesByCategory);

module.exports = router;
