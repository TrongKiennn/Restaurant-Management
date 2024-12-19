const express = require('express');
const Router = express.Router();
const productController = require("../../admin/products.controller");


Router.get("/", productController.index);
Router.get("/:id", productController.getProductById);
Router.patch("/delete", productController.deleteItem);
Router.delete("/delete-forever", productController.deleteItemForever);
Router.patch("/delete-multi", productController.deleteMulti);
Router.get("/createPage", productController.createPage);    // trang tạo món mới
Router.post("/createItem", productController.createProduct);// tạo món mới
module.exports = Router;