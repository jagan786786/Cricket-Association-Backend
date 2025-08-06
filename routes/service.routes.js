const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controllers");
const moduleController = require("../controllers/module.controllers");
const menuItemController = require("../controllers/menuitems.controllers");
const tournamentController = require('../controllers/tournament.controllers');
const formController = require("../controllers/formController.controllers");
const membershipController = require("../controllers/membership.controllers");


// Menu Item Routes
router.get("/menuitems", menuItemController.getAllMenuItems);
router.post("/menuitem", menuItemController.createMenuItem);
router.put("/menuitem/:id", menuItemController.updateMenuItem);

// Category Routes
router.get("/categories", categoryController.getAllCategories);
router.post("/category", categoryController.createCategory);
router.put("/category/:id", categoryController.updateCategory);
router.get('/categories/menuItem/:menuItemId', categoryController.getCategoriesByMenuItem);
router.delete("/category/:id", categoryController.deleteCategory);
router.patch("/category/:id/toggle-active", categoryController.toggleCategoryActive);

// Module Routes
router.post('/module', moduleController.createModule);
router.put('/module/:id', moduleController.updateModule);
router.delete('/module/:id', moduleController.deleteModule);
router.get('/modules', moduleController.getAllModules);
router.get('/modules/category/:categoryId', moduleController.getModulesByCategory);
router.get('/modules/menuItem/:menuItemId', moduleController.getModulesByMenuItem);
router.patch("/module/:id/toggle-active", moduleController.toggleModuleActive);


// Tournament Routes
router.post('/tournament', tournamentController.createTournament);
router.put('/tournaments/:id', tournamentController.updateTournament);
router.delete('/tournaments/:id', tournamentController.deleteTournament);
router.get('/tournaments', tournamentController.getAllTournaments);
router.get('/tournaments/category/:categoryId', tournamentController.getTournamentsByCategory);
router.get('/tournaments/menuItem/:menuItemId', tournamentController.getTournamentsByMenuItem);
router.patch("/tournament/:id/toggle-active", tournamentController.toggleTournamentActive);

//Membership routes
router.post("/membership", membershipController.createMembership);
router.put("/memberships/:id", membershipController.updateMembership);
router.delete("/memberships/:id", membershipController.deleteMembership);
router.get("/memberships", membershipController.getAllMemberships);
router.get("/memberships/menuitem/:menuItemId", membershipController.getMembershipsByMenuItem);
router.patch("/memberships/toggle/:id", membershipController.toggleMembershipActive);

//formController Routes
router.get("/instances/:menuItemId", formController.getInstancesByMenuItem);
router.post("/form", formController.createForm);
router.put("/form/:id", formController.updateForm);
router.patch("/form/:id/activate", formController.toggleFormActive);
router.post("/form-field", formController.createFormField);
router.post("/form-validation", formController.createValidation);
router.get("/forms", formController.getAllForms);
router.get("/form/:id", formController.getFormById);
router.put("/form/:formId/fields", formController.addOrUpdateFormFields);

module.exports = router;