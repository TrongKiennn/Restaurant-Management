const router = require("express").Router();
const logoutController = require('./logout.controller');

router.get('/', logoutController.logout);

module.exports = router;