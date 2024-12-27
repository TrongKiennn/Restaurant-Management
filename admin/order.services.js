const { parse } = require("dotenv");
const pool = require("../config/database");

async function getAllOrder(){
    const query = `
        SELECT * FROM orders
        `;
    const result = await pool.query(query);
    return result.rows;
}

module.exports = {
    getAllOrder
}