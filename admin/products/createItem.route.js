const express = require('express');
const Router = express.Router();

const createController = require("./createItem.controller");
const upload = require("../../config/multer.config");


Router.post("/" ,upload.single("product_url"), createController.createItem); // create new product

module.exports = Router;