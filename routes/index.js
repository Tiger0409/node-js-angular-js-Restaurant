var express = require('express');
var router = express.Router();
// var Cart = require('../models/cart');
// var Product = require('../models/product')(db);
// var Order = require('../models/order');
// var Cart = require('../models/cart');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
