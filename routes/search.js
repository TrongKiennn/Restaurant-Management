const express = require('express');
const router = express.Router();
const searchController = require('../apps/search/searchController');

router.get('/results', searchController.renderSearchResultsPage);

module.exports = router;