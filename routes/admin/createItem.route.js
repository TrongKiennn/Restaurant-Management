const express = require('express');
const Router = express.Router();

const createController = require("../../admin/createItem.controller");

Router.get("/", createController.createPage); // create new product page
Router.get("/", createController.createItem); // create new product

module.exports = Router;