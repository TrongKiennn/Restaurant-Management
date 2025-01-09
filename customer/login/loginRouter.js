const router = require("express").Router();
const passport = require("passport");
const loginController = require("./loginController");
require('./passport.js');
router.get("/",loginController.renderLoginPage);
router.post("/",passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/category',
    failureFlash: true,
}));

router.get("/",loginController.renderLoginPage);

module.exports = router;