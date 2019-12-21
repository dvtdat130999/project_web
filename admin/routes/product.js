var express = require('express');
var router = express.Router();
const productController = require('../controller/productController');
const {ensureAuthenticated}=require('../config/auth');


router.get('/', ensureAuthenticated, productController.getProducts);

router.post('/update', productController.postUpdate);


router.get('/upload', ensureAuthenticated, productController.getUpload);

router.post('/upload', productController.postUpload);




module.exports = router;