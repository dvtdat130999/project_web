var product = require('../databasemodel/products');
var category=require('../databasemodel/categories');
var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        product: function(callback) {
            product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        category: function(callback) {
            category.countDocuments({}, callback);
        },

    }, function(err, results) {
        res.render('index', { title: 'Customer', error: err, data: results });
    });
};
// Display list of all products.
exports.product_list = function(req, res,next) {
    product.find({},'name price')
        .exec(function (err, list_products) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('products/list', { title: 'Product List', product_list: list_products });
        });
};

// Display detail page for a specific product.
exports.product_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: product detail: ' + req.params.id);
};

// Display product create form on GET.
exports.product_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: product create GET');
};

// Handle product create on POST.
exports.product_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product create POST');
};

// Display product delete form on GET.
exports.product_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: product delete GET');
};

// Handle product delete on POST.
exports.product_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product delete POST');
};

// Display product update form on GET.
exports.product_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: product update GET');
};

// Handle product update on POST.
exports.product_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product update POST');
};