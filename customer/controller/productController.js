const product = require('../databasemodel/products');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = (req, res, next) =>  res.render('index', { userdata:req.user });

exports.getCart = (req, res, next) => res.render('cart', { userdata:req.user });

exports.getShip = (req, res, next) => res.render('ship', { userdata:req.user });

exports.getProduct = (req, res, next) => {
    const category = req.query.category;
    if (typeof category !== "undefined") {
        const id = req.query.id;
        if (typeof id !== "undefined") {
            productService.getProductById(id)
                .exec(function (err, list_products) {
                    if (err) {
                        return next(err);
                    }
                    //Successful, so render
                    res.render('products/productdetail', {
                        title: 'Diamond ring 2',
                        product_list: list_products,
                        userdata: req.user
                    });
                });
        } else {
            productService.getProductsByCategory(category)
                .exec(function (err, list_products) {
                    if (err) {
                        return next(err);
                    }
                    //Successful, so render
                    res.render('products/list', {title: 'Watch List', product_list: list_products, userdata: req.user});
                });
        }
    } else {
        productService.getAllProducts()
            .exec(function (err, list_products) {
                if (err) {
                    return next(err);
                }
                //Successful, so render
                res.render('products/list', {product_list: list_products, userdata: req.user});
            });
    }
}

exports.getStatus = (req, res, next) => res.render('status_products', {userdata:req.user});

exports.getAdvanced = (req, res, next) => res.render('advanced_searching',{userdata:req.user});

////////////////////////////////////////////////////////////////////////////