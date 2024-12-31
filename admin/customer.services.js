const { parse } = require("dotenv");
const pool = require("../config/database");

async function getAllCustomer(){
    const query = `
        SELECT * FROM users
        WHERE role = true
    `;
    const result = await pool.query(query);
    return result.rows;
}

async function getDetailCustomer(id){
    const query = `
        SELECT * FROM users
        WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    getAllCustomer,
    getDetailCustomer
}