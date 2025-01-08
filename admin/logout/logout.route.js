const Router = require("express").Router();
const logoutController = require('./logout.controller');

Router.get('/', logoutController.logout);

module.exports = Router;