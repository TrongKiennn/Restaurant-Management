const express = require('express');
const Router = express.Router();
const customerController = require('../../admin/customer.controller');

Router.get("/", customerController.index);
Router.get("/:id/detail", customerController.detail);
Router.get("/:id/detailOrder", customerController.detailOrder);

module.exports = Router;