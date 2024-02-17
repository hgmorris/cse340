
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities")
const Util = require("../utilities")


router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:vehicleId", 
  utilities.handleErrors(invController.BuildByVehicleId)
)



module.exports = router;