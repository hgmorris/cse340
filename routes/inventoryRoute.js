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
  "/", 
  utilities.handleErrors(invController.showManagementView)
)

router.get(
  "/add-classification", 
  utilities.handleErrors(invController.BuildAddClassification)
  )
  router.get(
    "/add-inventory", 
    utilities.handleErrors(invController.BuildAddInventory)
    )
    

  router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.AddNewClassification)
  ) 
  

router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,  
  utilities.handleErrors(invController.AddNewInventory)  
)

module.exports = router;