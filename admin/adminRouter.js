const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
  res.render('admin_views/admin_index', {
    title: 'Admin Dashboard', 
  });
});

module.exports = router;
