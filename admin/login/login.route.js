const express = require('express');
const passport = require('passport');
const Router = express.Router();
const loginController = require('./login.controller');
require('./passport');

Router.post("/",passport.authenticate('strategy',{
  
    failureRedirect: '/admin/login',
    successRedirect: '/admin/dashboard',
    failureFlash: true,
}));

Router.get("/", loginController.renderLoginPage);

module.exports = Router;