const e = require("connect-flash");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");



// Now you can use getClassifications...

const invCont = {}





/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details by vehicle view
 * ************************** */
invCont.BuildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getInventoryById(vehicle_id)
  const grid = await utilities.buildVehicleHtml(data)
  let nav = await utilities.getNav()
  res.render("./inventory/inventory", {
    title: data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model,
    nav,
    grid,
  })
}
 



/* ***************************
 *  Unit 4 - Build Add Inventory View
 *  Assignment 4
 * ************************** */
invCont.BuildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_id } = req.body
  const selectList = await utilities.getDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory" ,
    nav,
    selectList,
    errors: null,
  })
}

// add classification view

invCont.BuildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}



/* ***************************
 *  Build Management View
 *  Assignment 4 Task 1
 * ************************** */
invCont.showManagementView = async function(req, res) {
   try {
       let nav = await utilities.getNav()
       const dropdown = await utilities.getDropdown()
       res.render("./inventory/management", {
           title: "Vehicle Management",
           nav,
          errors: null,
          dropdown,
       });
   } catch (error) {
       console.error("Error loading management view:", error);
       res.status(500).send("Sorry, we appear to have lost that page.");
   }
};



/* ***************************
 *  Unit 4 - Add Classification 
 *  Assignment 4
 * ************************** */
invCont.AddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    add_classification, 
    classification_id 
  } = req.body

  let selectList = await utilities.getClassifications(classification_id)

  const classResult = await invModel.addClassification(add_classification)

  if (classResult) {
    
    req.flash(
      "notice",
      `Congratulations, you\'ve created the ${add_classification} classification!`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      selectList,
    })
  } else {
    req.flash("notice", "Sorry, that classification did not work. Please try again")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}




/* ***************************
 *  Unit 4 - Add Inventory 
 *  Assignment 4
 * ************************** */
invCont.AddNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  let selectList = await utilities.getClassifications(classification_id)

  const invResult = await invModel.addInventory(
    
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    )

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model} to the inventory!\n`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      selectList,
    })
  } else {
    req.flash("notice", "Sorry, there was an issue adding a new vehicle. Please try again.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      selectList,
    })
  }
}



/* ***************************
 *  Build edit inventory view
 *  Unit 5 update part 1
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const  SelectList = await utilities.getClassifications(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    selectList: selectSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 *  Unit 5 update activity part 2
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const selectList = await utilities.getClassifications(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      selectList: selectList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 *  Unit 5 Activity
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  console.log(invData)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  Delete Inventory Item
 *  Unit 5 Activity
 * ************************** */

invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 * Show Approval View
 * ***************************/
invCont.showApprovalView = async function(req, res) {
  try {
      // Assume getUnapprovedClassifications() and getUnapprovedInventoryItemsWithClassification()
      // are defined elsewhere in invModel
      const unapprovedClassifications = await invModel.getUnapprovedClassifications();
      const unapprovedInventoryItems = await invModel.getUnapprovedInventoryItemsWithClassification();
      const nav = await utilities.getNav();
      
      res.render("inventory/approve", {
          title: "Approve Inventory",
          nav, // Navigation for UI
          unapprovedClassifications, // Unapproved classifications
          unapprovedInventoryItems // Now includes classification names
      });
  } catch (error) {
      console.error("Error loading the approval view:", error);
      res.status(500).send("Error loading the page.");
  }
};

/* ***************************
* Approve Inventory Item
* ***************************/
invCont.approveInventoryItem = async function(req, res) {
  const invId = req.params.inv_id;
  if (!invId) {
      console.log("No inventory item ID provided.");
      req.flash('error', 'Inventory item not found.');
      return res.redirect('/inv/approve');
  }

  try {
      const itemData = await invModel.getInventoryById(invId);
      if (!itemData) {
          req.flash('error', 'Inventory item not found.');
          return res.redirect('/inv/approve');
      }

      await invModel.approveInventoryItemById(invId, req.accountData.account_id);
      req.flash('success', 'Inventory item approved successfully.');
      res.redirect('/inv/');
  } catch (error) {
      console.error("Error during inventory item approval:", error);
      req.flash('error', 'Failed to approve inventory item.');
      res.redirect('/inv/approve');
  }
};

/* ***************************
* Approve Classification
* ***************************/
invCont.approveClassification = async function(req, res) {
  const classificationId = req.params.classification_id;
  try {
      await invModel.approveClassificationById(classificationId, req.accountData.account_id);
      req.flash('success', 'Classification approved successfully.');
      res.redirect('/inv/approve'); // Adjusted redirection for consistency
  } catch (error) {
      console.error("Error approving classification:", error);
      req.flash('error', 'Failed to approve classification.');
      res.redirect('/inv/approve');
  }
};
// buildClassificationApprovalView

invCont.buildClassificationApprovalView = async function(req, res) {
  try {
      const unapprovedClassifications = await invModel.getUnapprovedClassifications();
      const nav = await utilities.getNav();
      res.render("inventory/approve-classification", {
          title: "Approve Classifications",
          nav,
          unapprovedClassifications
      });
  } catch (error) {
      console.error("Error loading classification approval view:", error);
      res.status(500).send("Error loading the page.");
  }
}


module.exports = invCont;