const express = require('express');
const Router = express.Router();
const detailCustomerController = require('../../admin/detailCustomer.controller');

Router.get("/", detailCustomerController.index);

module.exports = Router;