const express = require('express');
const Router = express.Router();

const createController = require("../../admin/createItem.controller");

Router.post("/", createController.createItem); // create new product

module.exports = Router;