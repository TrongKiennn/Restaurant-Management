const express = require('express');
const Router = express.Router();
const utils = require("../utils/jwtUtils");
const customerController = require('./customer.controller');


Router.use(utils.authMiddleware({ session: true }));

Router.get('/', customerController.index);
Router.get("/:id/detail", customerController.detail);
Router.get("/:id/detailOrder", customerController.detailOrder);

module.exports = Router;