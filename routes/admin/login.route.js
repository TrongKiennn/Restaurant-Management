const express = require('express');
const Router = express.Router();
const loginController = require('../../admin/login.controller');

Router.get("/", loginController.index);

module.exports = Router;