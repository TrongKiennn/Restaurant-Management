const { restart } = require("nodemon");
const orderService = require("./order.services");
const { parse } = require("dotenv");
const { json } = require("express");

// Get all order
module.exports.getAllOrder = async (req, res) => {
    productsList = [];
    try {
        const orders = await orderService.getAllOrder();

        res.render("admin_views/admin_manager_order.ejs", {
            title: "Order",
            orders: orders
        })
    } catch (error) {
        console.log(error);
    }
}
// Get order by id
module.exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);
        const orderDetails = await orderService.getOrderById(orderId);
        console.log(orderDetails);
        res.json({
            ok: true,
            details: orderDetails
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}

// Update order
module.exports.updateOrder = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const payment_status = req.body.payment_status;
    console.log(id);
    console.log("New status: ", status);
    console.log("New payment status: ", payment_status);

    try {
        const order = await orderService.updateOrder(id, status, payment_status);
        if (order) {
            res.status(200).json({
                ok: true,
                order: order
            })
        }
        else {
            res.status(400).json({ ok: false })
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}
// Get order by keyword
module.exports.getOrderByKeyword = async (req, res) => {
    const keyword = req.query.keyword;
    console.log(keyword);
    try {
        const orders = await orderService.getOrderByKeyword(keyword);
        if (orders.length === 0) {
            res.render("admin_views/admin_layouts/noOrder_result.ejs", {
                title: "Order",
                keyword: keyword
            });
        }
        else {
            res.render("admin_views/admin_manager_order.ejs", {
                title: "Order",
                orders: orders
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}
// Filter order
module.exports.filterOrder = async (req, res) => {
    console.log(req.query);

    let status = req.query.status;
    let payment_status = req.query.payment_status;

    if(status === 'In_Transit'){
        status = 'In Transit';
    }

    console.log(status);
    console.log(payment_status);

    try {
        const orders = await orderService.filterOrder(status, payment_status);
        if (orders.length === 0) {
            res.render("admin_views/admin_layouts/noOrder_result.ejs", {
                title: "Order",
                status: status,
                payment_status: payment_status
            });
            // res.status(200).json({
            //     ok: true,
            //     orders: orders
            // });
        }
        else {
            res.render("admin_views/admin_manager_order.ejs", {
                title: "Order",
                orders: orders,
                status: status,
                payment_status: payment_status
            });
            // res.status(200).json({
            //     ok: true,
            //     orders: orders
            // });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }    
}
// Delete order
module.exports.deleteOrder = async (req, res) => {
    const id = req.params.id;
    
    console.log(id);

    try {
        const result = await orderService.deleteOrder(id);
        if (result) {
            res.status(200).json({
                ok: true
            });
        }
        else {
            res.status(400).json({
                ok: false
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};
