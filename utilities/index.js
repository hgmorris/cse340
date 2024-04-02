/* **************************************
* Build the classification view HTML
* ************************************ */

const jwt = require("jsonwebtoken");
require("dotenv").config();
const invModel = require("../models/inventory-model");
// Import the pool object for database queries
const pool = require("../database");
const Util = {}

Util.getNav = async function () {
  try {
      const data = await invModel.getClassificationsWithApprovedItems();

      let list = "<ul>";
      list += '<li><a href="/" title="Home page">Home</a></li>';

      data.forEach((row) => {
          list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
      });

      list += "</ul>";
      return list;
  } catch (error) {
      console.error("Error generating navigation:", error);
      return "<ul><li>Error loading navigation</li></ul>";
  }
};

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="inv-container" id="inv-display">'
      data.forEach(vehicle => { 
            grid +='<div class="inv-card">'

            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
              grid += '<hr>'
              grid += '<h2>'
              grid += '<a class="vehicle-image" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
              + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
              + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
              grid += '</h2>'
              grid += '<span>$' 
              + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
          grid += '</div>'
          
      })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


Util.buildVehicleHtml = async function(vehicle){
  let grid
  if(vehicle){
    grid = '<div class="vehicle-content">'

      grid +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">'

      grid += '<div class="vehicle-details">'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
        grid += '<span><b>Price:</b> $' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '<p><b>Description:</b> ' + vehicle.inv_description + '</p>'
        grid += '<p><b>Color:</b> ' + vehicle.inv_color + '</p>'
        grid += '<p><b>Miles:</b> ' + vehicle.inv_miles + '</p>'

      grid += '</div>'
    
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.buildMessageHTML = async function(message){

  let date = new Date(message.message_created)
  let formattedDate = date.toLocaleDateString()
  let formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })


  let messageGrid = ''
  if(message){
    messageGrid += '<div class="message-page">'
      messageGrid += '<div class="message-container">'

        messageGrid += `<p class="message-message"><b>Date: </b>${formattedDate} ${formattedTime}</p>`
        messageGrid += `<p class="message-subject"> <b>Subject: </b>${message.message_subject}</p>`
        messageGrid += `<p class="message-from"><b>From: </b>${message.account_firstName} ${message.account_lastName}</p>`
        messageGrid += `<p style="white-space: pre-wrap;" class="message-message"><b>Message: </b>\n${message.message_body}</p>`
        
      messageGrid += `</div>`
      messageGrid += `<hr class="message-hr">`
      messageGrid += `<br>`
      

      messageGrid += `<div class="message-options">`

        // Reply to Message
        messageGrid += `<form action="/messages/replyMessage/${message.message_id}">`
          messageGrid += `<button type="submit" class="message-button">Reply</button>`
        messageGrid += `</form>`

        // Only display read button if the message_read is unread
        if (message.message_read == false) {
          // Mark as Read Messages
          messageGrid += `<form action="/messages/markAsRead/${message.message_id}" method="post">`
            messageGrid += `<button type="submit" class="message-button">Mark as Read</button>`
          messageGrid += `</form>`
        }

        // Only display archive button if the message is not archived
        if (message.message_archived == false) {
          // Archive Messages
          messageGrid += `<form action="/messages/archive/${message.message_id}" method="post">`
            messageGrid += `<button type="submit" class="message-button">Archive Message</button>`
          messageGrid += `</form>`
        }
        
        // Delete Messages
        messageGrid += `<form action="/messages/delete/${message.message_id}" method="post">`
          messageGrid += `<button type="submit" class="message-button">Delete Message</button>`
        messageGrid += `</form>`

      messageGrid += `</div>`

      // Takes you back to the inbox
      messageGrid += `<br>`
      messageGrid += `<a class="inbox-link" title="Inbox" href="/messages">Return to Inbox</a>`
      
      messageGrid += `<br>`
    messageGrid += `</div>`

    messageGrid += `<input type="hidden" name="message_id" value="${message.message_id}">`



  } else { 
    messageGrid += '<p class="notice">Sorry, no messages were found.</p>'
  }
  return messageGrid
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedIn = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
// Util.checkLogin = (req, res, next) => {
//   console.log("Checking login", res.locals)
//   if (res.locals.loggedIn) {
//     next()
//   } else {
//     req.flash("notice", "Please log in.")
//     return res.redirect("/account/login")
//   }
//  }


 Util.requireAdminOrEmployee = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
      next();
  } else {
      req.flash('error', 'You must be logged in as an Employee or Admin to access this page.');
      res.redirect('/account/login');
  }
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util