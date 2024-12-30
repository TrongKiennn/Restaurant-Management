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


async function updateOrder(id, status, payment_status) {
    const query = `
        UPDATE orders
        SET status = $1, status_payment = $2
        WHERE order_id = $3
        RETURNING *
    `
    const values = [
        status,
        payment_status,
        id
    ];
    try {
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.log("Error updating order: ", error);

        throw new Error("Error updating order");
    }
}

async function getOrderByKeyword(keyword) {
    const query = `
        SELECT * FROM orders
        WHERE order_code ILIKE $1
    `;
    const values = [`%${keyword}%`];
    const result = await pool.query(query, values);
    return result.rows;
}

async function filterOrder(status, payment_status) {
    try {
        const values = [];
        let query = `
        SELECT orders.*, users.name, users.email 
        FROM orders 
        JOIN users ON orders.user_id = users.id
        WHERE 1=1
    `;

        if (status) {
            values.push(status);
            query += ` AND orders.status = $${values.length}`;
        }

        if (payment_status) {
            values.push(payment_status);
            query += ` AND orders.status_payment = $${values.length}`;
        }

        query += ` ORDER BY orders.created_at DESC`;
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log("Error filtering order: ", error);
        throw new Error("Error filtering order");
    }

}

async function deleteOrder(orderId) {
    const queryORder = `
        DELETE FROM orders
        WHERE order_id = $1
    `;
    const queryDetailOrder = `
        DELETE FROM detail_orders
        WHERE order_id = $1
    `;
    const values = [orderId];
    try {
        await pool.query(queryDetailOrder, values);
        await pool.query(queryORder, values);
        return true;
    } catch (error) {
        console.log("Error deleting order: ", error);
        throw new Error("Error deleting order");
    }

}

module.exports = {
    getAllOrder,
    calculateTotalPrice,
    getOrderById,
    updateOrder,
    getOrderByKeyword,
    filterOrder,
    deleteOrder
}