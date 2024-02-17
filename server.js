/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require('./utilities/');

const baseController = require("./controllers/baseController")

const expressLayouts = require("express-ejs-layouts")
const inventoryRoute = require("./routes/inventoryRoute")

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(static)


/* ***********************
 * Routes
 *************************/
//Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

 

// Inventory routes - Unit 3 
app.use("/inv", utilities.handleErrors(require("./routes/inventoryRoute")))

// Error Route (For testing and Assignment 3)
app.get("/error", utilities.handleErrors(baseController.buildError))

// File Not Found Route - must be last route in list

app.use(async (req, res, next) => {
next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const PORT = process.env.PORT
const HOST = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(PORT, () => {
  console.log(`app listening on ${HOST}:${PORT}`)
});