const express = require('express');
const Router = express.Router();
const customerController = require('../../admin/customer.controller');

Router.get("/", customerController.index);

module.exports = Router;