const express = require('express');
const Router = express.Router();
const productController = require("../../admin/products.controller");

Router.get("/", productController.index); // get all products

Router.get("/:id", productController.getProductById);

Router.patch("/delete", productController.deleteItem); // soft delete an item

Router.delete("/delete-forever", productController.deleteItemForever); // delete an item forever
Router.delete("/delete-multi-forever", productController.deleteMultiForever); // delete multiple items forever

Router.patch("/delete-multi", productController.deleteMulti); // soft delete multiple items


module.exports = Router;