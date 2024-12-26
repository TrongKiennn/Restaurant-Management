const express = require('express');
const Router = express.Router();
const productController = require("../../admin/products.controller");
const upload = require("../../config/multer.config");

Router.get("/", productController.index); // get all products

Router.get("/search", productController.getProductsByKeyword); // get products by keyword

Router.patch("/delete", productController.deleteItem); // soft delete an item

Router.delete("/delete-forever", productController.deleteItemForever); // delete an item forever
Router.delete("/delete-multi-forever", productController.deleteMultiForever); // delete multiple items forever

Router.patch("/delete-multi", productController.deleteMulti); // soft delete multiple items

Router.patch("/change-status", productController.updateStatus); // change status
Router.patch("/update",upload.single('product_url') ,productController.updateProduct); // update an item

module.exports = Router;