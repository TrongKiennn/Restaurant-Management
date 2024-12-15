const express = require('express');
const router = express.Router();
const path = require('path');

// Route chính cho admin_index.ejs
router.get('/', (req, res) => {
  res.render('admin_views/admin_index', {
    title: 'Admin Dashboard', // Thêm biến truyền vào view nếu cần
  });
});

module.exports = router;
