/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const expressLayouts = require("express-ejs-layouts")

const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

/* ***********************
 * Routes
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
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