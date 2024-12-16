const express = require('express');
const Router = express.Router();
const dashboardController = require('../../admin/index.controller');

Router.get("/", dashboardController.index);

module.exports = Router;