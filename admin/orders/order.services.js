const { parse } = require("dotenv");
const pool = require("../../config/database");
// const { get } = require("../customer/registration/registrationRouter");

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
        orders.order_code,
        orders.address,
        detail_orders.quantity,
        products.name as product_name,
        products.price as original_price,
        products.product_url,
        products.discount,
        products.is_discount_active,
        CASE 
            WHEN products.is_discount_active = true 
            THEN ROUND(products.price * (1 - products.discount::float/100))
            ELSE products.price 
        END as final_price,
        orders.*,
        users.name,
        users.email,
        users.phone
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

const ORDER_STATUS = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    DELIVERED: 'Đã giao cho ĐVVC',
    IN_TRANSIT: 'Đang vận chuyển',
    COMPLETED: 'Hoàn thành',
    CANCELED: 'Đã hủy'
};

const PAYMENT_STATUS = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    PENDING: 'Đang chờ'
};

async function updateOrder(id, status, payment_status) {
    // Map Vietnamese status back to English for DB
    const statusMap = {
        'Chờ xác nhận': 'Pending',
        'Đã xác nhận': 'Confirmed',
        'Đã giao cho ĐVVC': 'Delivered',
        'Đang vận chuyển': 'In Transit',
        'Hoàn thành': 'Completed',
        'Đã hủy': 'Canceled'
    };

    const paymentStatusMap = {
        'Chưa thanh toán': 'Unpaid',
        'Đã thanh toán': 'Paid',
    };

    const dbStatus = statusMap[status] || status;
    const dbPaymentStatus = paymentStatusMap[payment_status] || payment_status;

    const query = `
        UPDATE orders
        SET 
            status = $1::varchar,
            status_payment = $2::varchar,
            canceled_at = CASE 
                WHEN $1::varchar = 'Canceled' THEN CURRENT_TIMESTAMP 
                ELSE canceled_at 
            END,
            completed_at = CASE 
                WHEN $1::varchar = 'Completed' THEN CURRENT_TIMESTAMP 
                ELSE completed_at 
            END
        WHERE order_id = $3
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, [dbStatus, dbPaymentStatus, id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating order:", error);
        throw new Error("Lỗi khi cập nhật đơn hàng");
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

async function getRevenue(){
    const query = `
       SELECT COALESCE(SUM(total)::numeric(18,2), 0) as total_revenue
        FROM orders
        WHERE status = 'Completed'
    `;
    try {
        const result = await pool.query(query);
        const revenue = parseFloat(result.rows[0].total_revenue);
        return Math.round(revenue); // Round to whole number for display
    } catch (error) {
        console.error("Error getting revenue:", error);
        throw error;
    }
}

async function countOrder(){
    const query = `
        SELECT COUNT(*) as total_orders
        FROM orders
    `;
    const result = await pool.query(query);
    return parseInt(result.rows[0].total_orders);
}

module.exports = {
    getAllOrder,
    calculateTotalPrice,
    getOrderById,
    updateOrder,
    getOrderByKeyword,
    filterOrder,
    deleteOrder,
    getRevenue,
    countOrder
}