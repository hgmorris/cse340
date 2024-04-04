const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");

const invController = {};

// Build inventory by classification ID
invController.buildByClassificationId = async (req, res, next) => {
  try {
    const classificationId = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : 'Unknown Classification';
    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

// Build vehicle details by vehicle ID
invController.buildByVehicleId = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    const data = await invModel.getInventoryById(vehicleId);
    if (!data) {
      return res.status(404).send('Vehicle not found.');
    }
    const grid = await utilities.buildVehicleHtml(data);
    const nav = await utilities.getNav();
    res.render("inventory/inventory", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

// Display form to add inventory
invController.buildAddInventory = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const selectList = await utilities.getDropdown('classification');
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      selectList,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Display form to add classification
invController.buildAddClassification = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Show management view
invController.showManagementView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const dropdown = await utilities.getDropdown();
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      dropdown,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Process new classification addition
invController.addNewClassification = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // handle errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { classificationName } = req.body;
    const result = await invModel.addClassification(classificationName);
    if (result) {
      // Assuming req.flash is available through middleware
      req.flash("success", "New classification added successfully.");
      res.redirect("/inventory/classifications");
    } else {
      throw new Error("Failed to add new classification.");
    }
  } catch (error) {
    next(error);
  }
};

// Process new inventory addition
invController.addNewInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // handle errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const inventoryData = req.body; // Assuming body contains all necessary inventory fields
    const result = await invModel.addInventory(inventoryData);
    if (result) {
      req.flash("success", "New inventory item added successfully.");
      res.redirect("/inventory/items");
    } else {
      throw new Error("Failed to add new inventory item.");
    }
  } catch (error) {
    next(error);
  }
};

// Display edit inventory form
invController.editInventoryView = async (req, res, next) => {
  try {
    const inventoryId = req.params.inv_id;
    const itemData = await invModel.getInventoryById(inventoryId);
    if (!itemData) {
      return res.status(404).send('Inventory item not found.');
    }
    const nav = await utilities.getNav();
    const selectList = await utilities.getDropdown('classification');
    res.render("inventory/edit-inventory", {
      title: `Edit Inventory Item`,
      nav,
      selectList,
      itemData,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory item
invController.updateInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // handle errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const inventoryId = req.body.inv_id;
    const updateData = req.body; // Assuming body contains all fields for the inventory item
    const result = await invModel.updateInventory(inventoryId, updateData);
    if (result) {
      req.flash("success", "Inventory item updated successfully.");
      res.redirect("/inventory/items");
    } else {
      throw new Error("Failed to update inventory item.");
    }
  } catch (error) {
    next(error);
  }
};





// show classification Approval list
invController.showClassificationListApproval = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const pendingClassifications = await invModel.getPendingClassifications();
    console.log("pendingClassifications",pendingClassifications);
    res.render("inventory/classification-approval", {
      title: "Classification Approval",
      nav,
      pendingClassifications,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};





// Get inventory by classification in JSON format
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classificationId = req.params.classification_id;
    const inventoryData = await invModel.getInventoryByClassificationId(classificationId);
    res.json(inventoryData);
  } catch (error) {
    next(error);
  }
};

// Display delete inventory item view
invController.deleteView = async (req, res, next) => {
  try {
    const inventoryId = req.params.inv_id;
    const itemData = await invModel.getInventoryById(inventoryId);
    if (!itemData) {
      return res.status(404).send('Inventory item not found.');
    }
    const nav = await utilities.getNav();
    res.render("inventory/delete", {
      title: `Delete Inventory Item`,
      nav,
      itemData,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// Show approval view for inventory and classifications
invController.showApprovalView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    // Assuming methods for fetching unapproved items exist
    const pendingClassifications = await utilities.getPendingClassifications();
    // const unapprovedInventoryItems = await invModel.getUnapprovedInventoryItems();
    res.render("inventory/classification-approval", {
      title: "Approve Items",
      nav,
      pendingClassifications,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};


// Inventory items Pending Approval
invController.showInventoryApproval = async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    const pendingInventory = await invModel.getPendingInventory();
    res.render("inventory/inventory-approval", {
      title: "Inventory Approval",
      nav,
      pendingInventory,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};




module.exports = invController;

