// Import the pool object configured for database connection
const pool = require("../database/");

// Retrieves all classification data, ordered by classification name
async function getClassifications() {
  try {
    return await pool.query("SELECT * FROM public.classification  WHERE classification_approved = true ORDER BY classification_name");
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error getting classifications: ${error.message}`);
  }
}

// Get Pending Classifications

// async function getPendingClassifications() {
//   try {
//     return await pool.query("SELECT * FROM public.classification  WHERE classification_approved = false ");
//   } catch (error) {
//     // Throws an error with a specific message if the query fails
//     throw new Error(`Error getting classifications: ${error.message}`);
//   }
// }

async function getPendingClassifications() {
  try {
    const data = await pool.query(`
      SELECT *
      FROM public.classification
      WHERE classification_approved = false
    `);
    // console.log(data);
    return data.rows;
  } catch (error) {
    throw new Error('Error retrieving unapproved classifications: ' + error.message);
  }
}




// Get all Unapproved Classifications
// async function classificationPendingApproval() {
//   const query = `
//   SELECT c.classification_id, c.classification_name
//   FROM public.classification c
//   WHERE c.classification_approved = false
//   ORDER BY c.classification_name
//   `
//   return await pool.query(query)
// }

// Get all Unapproved Inventory Items
async function getUnapprovedInventoryItems() {
  const query = `
  SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description,
   i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_miles, i.inv_color, i.classification_id
  FROM public.inventory i
  WHERE i.inv_approved = false
  ORDER BY i.inv_make, i.inv_model
  `
  return await pool.query (query) 
}



// Retrieves data for a specific vehicle by vehicle ID
async function getInventoryById(vehicle_id) {
  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [vehicle_id]);
    return data.rows[0];
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error getting inventory by ID: ${error.message}`);
  }
}

// Inserts a new classification into the database
async function addClassification(add_classification) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [add_classification]);
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error adding classification: ${error.message}`);
  }
}

// Checks if a classification name already exists in the database
async function checkExistingClassification(add_classification) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1";
    const classification = await pool.query(sql, [add_classification]);
    return classification.rowCount;
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error checking existing classification: ${error.message}`);
  }
}

// Inserts a new inventory item into the database with detailed attributes
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error adding inventory: ${error.message}`);
  }
}

// Updates inventory data based on a given inventory ID
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error updating inventory: ${error.message}`);
  }
}


// Deletes an inventory item based on its inventory ID
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *";
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    // Throws an error with a specific message if the query fails
    throw new Error(`Error deleting inventory item: ${error.message}`);
  }
}

// Exporting functions to be available for use in other files
module.exports = {
  getClassifications,  
  getInventoryById,
  addClassification,
  checkExistingClassification,
  addInventory,
  updateInventory,
  deleteInventoryItem,
  // classificationPendingApproval,
  getUnapprovedInventoryItems,
  getPendingClassifications,
};


