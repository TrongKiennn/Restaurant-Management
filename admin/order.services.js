const { parse } = require("dotenv");
const pool = require("../config/database");
const { get } = require("../customer/registration/registrationRouter");

async function getAllOrder() {
    const query = `
        SELECT * FROM orders JOIN users ON orders.user_id = users.id
        `;
    const result = await pool.query(query);
    return result.rows;
}


async function calculateTotalPrice(orderId) { // tính tổng tiền của 1 đơn hàng
    const query = `
        SELECT SUM(products.price * order_details.quantity) AS total_price
        FROM order_details
        JOIN products ON order_details.product_id = products.product_id
        WHERE order_details.order_id = $1
    `;
    const values = [orderId];
    const result = await pool.query(query, values);
    return result.rows[0].total_price;
}

async function getOrderById(orderId) {
    const query = `
    SELECT 
        detail_orders.quantity,
        products.name as product_name,
        products.price,
        products.product_url,
        orders.*,
        users.name,
        users.email
    FROM orders 
    JOIN users ON orders.user_id = users.id
    JOIN detail_orders ON orders.order_id = detail_orders.order_id
    JOIN products ON detail_orders.product_id = products.product_id
    WHERE orders.order_id = $1
    `;
    const values = [orderId];
    const result = await pool.query(query, values);
    return result.rows;
}


module.exports = {
    getAllOrder,
    calculateTotalPrice,
    getOrderById
}