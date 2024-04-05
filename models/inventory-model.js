
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

async function getUnapprovedClassifications() {
  const query = "SELECT * FROM classification WHERE classification_approved = false";
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (err) {
      console.error(err);
      throw err;
  }
}
async function getUnapprovedInventoryItems() {
  const query = "SELECT * FROM inventory WHERE inv_approved = false";
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (err) {
      console.error(err);
      throw err;
  }
}

// async function getClassificationsWithApprovedItems() {
//   const query = `
//       SELECT DISTINCT c.classification_id, c.classification_name 
//       FROM classification c
//       INNER JOIN inventory i ON c.classification_id = i.classification_id 
//       WHERE c.classification_approved = true AND i.inv_approved = true
//       ORDER BY c.classification_name`;
//   try {
//       const result = await pool.query(query);
//       return result.rows;
//   } catch (err) {
//       console.error("Error fetching classifications with approved items: ", err);
//       throw err;
//   }
// }

async function getClassificationsWithApprovedItems() {
  const query = `
      SELECT DISTINCT c.classification_id, c.classification_name 
      FROM classification c
      INNER JOIN inventory i ON c.classification_id = i.classification_id 
      WHERE c.classification_approved = true AND i.classification_approved = true
      ORDER BY c.classification_name`;
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (err) {
      console.error("Error fetching classifications with approved items: ", err);
      throw err;
  }
}



async function getUnapprovedInventoryItemsWithClassification() {
  const query = `
      SELECT i.*, c.classification_name 
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id 
      WHERE i.classification_approved = false
      ORDER BY c.classification_name, i.inv_make, i.inv_model`;
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (err) {
      console.error("Error fetching unapproved inventory items with classification: ", err);
      throw err;
  }
}

async function approveInventoryItemById(invId, accountId) {
  const query = `
      UPDATE inventory
      SET classification_approved = true, account_id = $2, classification_approval_date = NOW()
      WHERE inv_id = $1
      RETURNING *`;
  try {
      const result = await pool.query(query, [invId, accountId]);
      return result.rows[0]; 
  } catch (err) {
      console.error("Error approving inventory item by ID:", err);
      throw err;
  }
}

async function approveClassificationById(classificationId, accountId) {
  const query = `
      UPDATE classification 
      SET classification_approved = TRUE, 
          account_id = $2, 
          classification_approval_date = NOW()
      WHERE classification_id = $1
      RETURNING *;`;

  try {
      const res = await pool.query(query, [classificationId, accountId]);
      return res.rows[0];
  } catch (err) {
      console.error("Error approving classification by ID:", err);
      throw err;
  }
}
async function approveInventoryItem (req, res) {
};

async function getApprovedClassifications() {
  try {
      const result = await pool.query("SELECT * FROM classification WHERE is_approved = TRUE ORDER BY classification_name");
      return result.rows;
  } catch (error) {
      console.error("Error fetching approved classifications:", error);
      throw error;
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
  getUnapprovedClassifications,
  getUnapprovedInventoryItems,
  getClassificationsWithApprovedItems,
  getUnapprovedInventoryItemsWithClassification,
  approveInventoryItemById,
  approveClassificationById,
  approveInventoryItem,
  getApprovedClassifications 
};

