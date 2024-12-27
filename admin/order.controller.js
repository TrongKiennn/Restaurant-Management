const { restart } = require("nodemon");
const ordertService = require("./order.services");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.index = async (req, res) => {
    try{
        const orders = await ordertService.getAllOrder();
        res.render("admin_views/admin_manager_order.ejs", {
            title: "Order",
            orders: orders
        })
    } catch (error) {
        console.log(error);
    }
}


