const { parse } = require("dotenv");
const pool = require("../config/database");
const orderService = require("./order.services");
const { getDefaultHighWaterMark } = require("form-data");

async function getAllCustomer() {
    const query = `
        SELECT * FROM users
        WHERE role = true
    `;
    const result = await pool.query(query);
    return result.rows;
}

async function getTotalPrice(id) {
    const query = `
        SELECT SUM(total) FROM orders
        WHERE user_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0].sum;
}

async function countOrder(id) {
    const query = `
        SELECT COUNT(*) FROM orders
        WHERE user_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0].count;
}

async function getDetailCustomer(id) {
    const query = `
        SELECT users.* FROM users
        WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function getOrderByUserId(id) {
    const query = `
        SELECT * FROM orders
        WHERE user_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
}

async function getDetailOrder(id) {
    const query = `
        SELECT 
            orders.*
        FROM orders 
        WHERE orders.order_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function getItemsFromOrder(id){
    const query=`
        SELECT
            products.name as product_name,
            products.price,
            detail_orders.quantity,
            products.product_url,
            products.discount,
            products.is_discount_active,
            CASE 
                WHEN products.is_discount_active = true 
                THEN products.price * (1 - products.discount::float/100)
                ELSE products.price 
            END as final_price
        FROM detail_orders 
        JOIN orders ON detail_orders.order_id = orders.order_id
        JOIN products ON detail_orders.product_id = products.product_id
        WHERE orders.order_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
}


module.exports = {
    getAllCustomer,
    getDetailCustomer,
    countOrder,
    getTotalPrice,
    getOrderByUserId,
    getDetailOrder,
    getItemsFromOrder
}