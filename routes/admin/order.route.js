const express = require('express');
const Router = express.Router();
const orderController = require('../../admin/order.controller');

Router.get("/", orderController.index);

module.exports = Router;