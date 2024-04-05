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
// invController.showClassificationListApproval = async (req, res, next) => {
//   try {
//     const nav = await utilities.getNav();
//     const pendingClassifications = await invModel.getPendingClassifications();
//     console.log("pendingClassifications",pendingClassifications);
//     res.render("inventory/classification-approval", {
//       title: "Classification Approval",
//       nav,
//       pendingClassifications,
//       errors: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };





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

/* ***************************
 *  Show Approval View
 * ************************** */
invController.showApprovalView = async function(req, res) {
  try {
      // Assume getUnapprovedClassifications() is defined elsewhere in invModel
      let unapprovedClassifications = await invModel.getUnapprovedClassifications();
      
      // Use the new function that includes classification names
      let unapprovedInventoryItems = await invModel.getUnapprovedInventoryItemsWithClassification();
      
      let nav = await utilities.getNav(); 
      res.render("inventory/classification-approval", {
          title: "Approve Inventory",
          nav,
          unapprovedClassifications, 
          unapprovedInventoryItems // Now includes classification names
      });
  } catch (error) {
      console.error("Error loading the approval view:", error);
      res.status(500).send("Error loading the page.");
  }
};


invController.approveInventoryItem = async function(req, res) {
  const invId = req.params.inv_id;
  if (!invId) {
      console.log("No inventory item ID provided.");
      req.flash('error', 'Inventory item not found.');
      return res.redirect('/inv/approve');
  }

  console.log("Approving inventory item with ID:", invId);

  try {
      const itemData = await invModel.getInventoryById(invId);
      if (!itemData) {
          req.flash('error', 'Inventory item not found.');
          return res.redirect('/inv/approve');
      }

      await invModel.approveInventoryItemById(invId, res.locals.accountData.account_id);

      req.flash('success', 'Inventory item approved successfully.');
      res.redirect('/inv/');
  } catch (error) {
      console.error("Error during inventory item approval:", error);
      req.flash('error', 'Failed to approve inventory item.');
      res.redirect('/inv/approve');
  }
};

invController.approveClassification = async function(req, res) {
  const classificationId = req.params.classification_id;
  try {
      // Assuming invModel has a method called approveClassificationById that updates classification_approved to true
      await invModel.approveClassificationById(classificationId, req.accountData.account_id); // Log the admin's ID
      
      req.flash('success', 'Classification approved successfully.');
      res.redirect('/inv/approve'); // Redirect back to the approval page
  } catch (error) {
      console.error("Error approving classification:", error);
      req.flash('error', 'Failed to approve classification.');
      res.redirect('/inv/approve'); // Redirect back to the approval page with an error message
  }
};

invController.approveClassification = async function(req, res) {
  const classificationId = req.params.classification_id; // Ensure this matches the route parameter
  try {
    console.log("res.accountData",res.locals.accountData);
      await invModel.approveClassificationById(classificationId, res.locals.accountData.account_id); // Assuming this function exists and works as intended
      req.flash('success', 'Classification approved successfully.');
      res.redirect('/account'); // Assuming you want to redirect here
  } catch (error) {
      console.error("Error approving classification:", error);
      req.flash('error', 'Failed to approve classification.');
      res.redirect('/inv/approve'); // Assuming you want to redirect back in case of failure
  }
};

invController.addInventoryItem = async function(req, res) {
  try {
      // Extract data from request body
      const { make, model, year, description, image_path, thumbnail_path, price, miles, color, classification_id } = req.body;

      // Call your model function to add the inventory item
      await invModel.addInventoryItem({
          inv_make: make,
          inv_model: model,
          inv_year: year,
          inv_description: description,
          inv_image: image_path,
          inv_thumbnail: thumbnail_path,
          inv_price: price,
          inv_miles: miles,
          inv_color: color,
          classification_id
      });

      // Set a success message
      req.flash('success', 'Inventory item added successfully.');
      // Redirect to the account page
      res.redirect('/account');
  } catch (error) {
      console.error("Failed to add inventory item:", error);
      // Set an error message
      req.flash('error', 'Failed to add inventory item.');
      // Redirect back to the approval page (or wherever the form is located)
      res.redirect('/inv/approve');
  }
};


module.exports = invController;

