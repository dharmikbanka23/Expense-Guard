var express = require('express');
var router = express.Router();
require('dotenv').config();

// simulating a bad route to test error handling
router.get('/bad', function(req, res) {
  test = test;
});

module.exports = router;