const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const { classificationRules, inventoryRules, checkClassificationData, checkInventoryData, checkUpdateData } = require('../utilities/inventory-validation');
const utilities = require("../utilities");

// Route to build inventory by classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details by vehicle ID
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to return inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route for the main management view
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.showManagementView));

// Route for building the classification approval view
router.get("/classification-approval", utilities.checkLogin, utilities.handleErrors(invController.buildClassificationApprovalView));

// Route for adding a new classification - GET and POST
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", classificationRules(), checkClassificationData, utilities.handleErrors(invController.addNewClassification));

// Route for adding a new inventory item - GET and POST
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", inventoryRules(), checkInventoryData, checkClassificationData, utilities.handleErrors(invController.addNewInventory));

// Route for editing an inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route for updating an inventory item
router.post("/update/", inventoryRules(), checkUpdateData, checkClassificationData, utilities.handleErrors(invController.updateInventory));

// Route for deleting an inventory item
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));
// Ensure this matches the controller's method if it's different. You might need a POST route here if your application supports deleting via POST.

// Routes for approval processes

// Route to return inventory by classification as JSON with error handling
router.get('/approve/classification/:classification_id', utilities.requireAdminOrEmployee, invController.approveClassification);


// Route to show the approval view
router.get('/approve', utilities.requireAdminOrEmployee, invController.showApprovalView);


router.get('/approve/inventory/:inv_id', utilities.requireAdminOrEmployee, invController.approveInventoryItem);


module.exports = router;

