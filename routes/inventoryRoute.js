// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities")
const Util = require("../utilities")

// Routes

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)
)

router.get( "/detail/:vehicleId", utilities.handleErrors(invController.BuildByVehicleId)
)

router.get(
  "/add-classification", 
  utilities.handleErrors(invController.BuildAddClassification)
  )

  router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.AddNewClassification)
  ) 
  


router.get(
  "/add-inventory", 
  utilities.handleErrors(invController.BuildAddInventory)
  )
router.get(
  "/", 
  utilities.handleErrors(invController.BuildManagement)
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,  
  utilities.handleErrors(invController.AddNewInventory)  
)

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)
router.post(
  "/update/", 
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)


module.exports = router;