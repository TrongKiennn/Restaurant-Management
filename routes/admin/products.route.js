const express = require('express');
const Router = express.Router();
const productController = require("../../admin/products.controller");

Router.get("/", productController.index); // get all products
Router.get("/:id", productController.getProductById);

Router.patch("/delete", productController.deleteItem);
Router.delete("/delete-forever", productController.deleteItemForever);
Router.patch("/delete-multi", productController.deleteMulti);


module.exports = Router;