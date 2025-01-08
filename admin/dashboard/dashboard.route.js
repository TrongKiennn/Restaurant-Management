const express = require('express');
const Router = express.Router();
const dashboardController = require('./index.controller');
const utils = require('../utils/jwtUtils');

Router.use(utils.authMiddleware({ session: true }));

Router.get("/", dashboardController.index);

module.exports = Router;