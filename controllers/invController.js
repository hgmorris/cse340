
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
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

module.exports = invCont