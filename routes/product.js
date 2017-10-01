var express = require('express');
var fileUpload = require('express-fileupload');
var router = express.Router();

module.exports = function(db) {

	var Product = require('../models/product')(db);

	router.get('/getAllProduct', function (req, res, next) {
		Product.getAllProduct().then(function(resJson) {
			res.json({status: true, Product: resJson});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	router.post('/getProductById', function(req, res, next) {
		Product.getProductById(req.body).then(function(resJson) {
			res.json({status: true, Product: resJson});
		}).catch(function(err) {
			res.Json({status: false});
		});
	});
	router.post('/addProduct', function(req, res, next) {
	
		Product.addProduct(req.body).then(function(resJson) {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
		
	});
	
	router.post('/uploadfile',function(req,res,next){
		console.log(req.body)
		if (!req.files)
			return res.status(400).send(false);
		var file = req.files.file;
		var typ = file.mimetype.split("/");
		var fileName = req.body.short_title+Date.now()+"."+typ[1];
		file.mv('public/upload/'+fileName, function(err) {
			if (err){
				res.json({fileName: false});
			} else {
				fileName='upload/'+fileName;
				res.json({fileName: fileName});
			}
		});
		
	});
	
	router.post('/deleteProduct', function(req, res, next) {
		Product.deleteProduct(req.body).then(function() {
			res.json({status: true});
		}).catch(function(err) {
			res.json({status: false});
		});
	});
	return router;
}
