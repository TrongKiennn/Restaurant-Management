const { restart } = require("nodemon");
const orderService = require("./order.services");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.getAllOrder = async (req, res) => {
    productsList = [];
    try{
        const orders = await orderService.getAllOrder();

        res.render("admin_views/admin_manager_order.ejs", {
            title: "Order",
            orders: orders
        })
    } catch (error) {
        console.log(error);
    }
}

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