const utilities = require("../utilities/")
const baseController = {}


baseController.buildHome = async function(req, res){

// console.log("In buildHome")
const nav = await utilities.getNav()
// req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

// baseController.buildAdmin = async function(req, res){
//   const nav = await utilities.getNav()
//   res.render("admin", {title: "Admin", nav})
// }

module.exports = baseController

