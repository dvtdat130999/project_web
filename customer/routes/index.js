var express = require('express');
var router = express.Router();
var product = require('../databasemodel/products');
var category = require('../databasemodel/categories');
const productService = require('../models/productService');
const mongoose = require('mongoose');

var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* get login page*/
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* get register page*/
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* get forget_password page*/
router.get('/forget', function(req, res, next) {
  res.render('forget_password', { title: 'Express' });
});
/* get cart page*/
router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

/* get my account page*/
router.get('/account', function(req, res, next) {
  res.render('my_account', { title: 'Express' });
});

/* get ship information page*/
router.get('/ship', function(req, res, next) {
  res.render('ship', { title: 'Express' });
});

/// PRODUCT ROUTES ///

// GET request for list of all Product.
router.get('/products',  function(req, res, next){
    const category = req.query.category;
    if(typeof category !== "undefined")
    {
        const name = req.query.name;

        if(typeof name !== "undefined")
        {
            var id;
            switch (name) {
                case 'donghovang':
                    id = "5dd21dc3708e8600901a63b4";
                    break;
                case 'kimcuong1':
                    id = "5dd2465c0f4a47226ccfaaf8";
                    break;
                case 'kimcuong2':
                    id = "5dd2468c25e95c32183394f0";
                    break;
                case 'kimcuong3':
                    id = "5dd246a331b2ee2674c59bc4";
                    break;
                case 'nhanlamngoc':
                    id = "5dd36835503b2b3250e9fb5c";
                    break;
                case 'vongvang':
                    id = "5dd245fafaf28853f0b0bd93";
                    break;
                case 'vongkimcuong':
                    id = "5dd24644da39c2528019b79e";
                    break;
                case 'vongtay':
                    id = "5dd2462ff0499a37dc0f2545";
                    break;
                case 'vongco':
                    id = "5dd246763e9623160c183e89";
                    break;
                case 'vongcodoi':
                    id = "5dd246b92633e93ae8b84b2a";
                    break;
            }
            productService.findById(id)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/productdetail', { title: 'Diamond ring 2', product_list: list_products });
                });
        }
        else
        {
            productService.findByCatagory(category)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/list', { title: 'Watch List', product_list: list_products });
                });
        }
    }
    else
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                res.render('products/list', { product_list: list_products });
            });
    }
});


/*// GET request for creating Product. NOTE This must come before route for id (i.e. display author).
router.get('/product_create', product_controller.product_create_get());

// POST request for creating Product.
router.post('/product_create', product_controller.product_create_post());

// GET request to delete Product.
router.get('/product_delete/:id', product_controller.product_delete_get());

// POST request to delete Product.
router.post('/product_delete/:id', product_controller.product_delete_post());

// GET request to update Product.
router.get('/product_update/:id', product_controller.product_update_get());

// POST request to update Product.
router.post('/product_update/:id', product_controller.product_update_post());

// GET request for one Product.
router.get('/product/:id', product_controller.product_detail());*/




/* get product status page*/
router.get('/status', function(req, res, next) {
  res.render('status_products', { title: 'Express' });
});

/* get advanced searching page*/
router.get('/advanced', function(req, res, next) {
  res.render('advanced_searching', { title: 'Express' });
});
/* GET product list page. */
/*router.get('/products', function(req, res, next) {
  res.render('products/list', { title: 'Product list' });
});*/

/* get product watches page*/
// router.get('/watch', function(req, res, next) {
//   res.render('products/watch', { title: 'Express' });
// });


/* get product jewel page*/
router.get('/jewel', function(req, res, next) {
  res.render('products/jewel', { title: 'Express' });
});


/* get product detail page*/
router.get('/detail', function(req, res, next) {
  res.render('products/detail', { title: 'Express' });
});

//insert product
router.post('/insert_new_product', function(req, res, next) {
  const newProduct=new product({
    /*name:'Đồng hồ vàng',
    price:22000000,
    description:"Đồng hồ vàng chất lượng cao",
    thumbnail: 'assets/img/a.jpg',
    category:1,*/
    /*name:'Vòng vàng',
    price:12000000,
    description:"Vòng vàng chất lượng cao",
    thumbnail: 'assets/img/b.jpg',
    category:2,*/
    /*name:'Vòng tay',
    price:9000000,
    description:"Vòng tay đẹp",
    thumbnail: 'assets/img/c.jpg',
    category:2,*/
    /*name:'Vòng kim cương',
    price:22000000,
    description:"Vòng kim cương chất lượng cao",
    thumbnail: 'assets/img/d.jpg',
    category:2,*/
    /*name:'Nhẫn kim cương',
    price:30000000,
    description:"Nhẫn kim cương chất lượng cao",
    thumbnail: 'assets/img/e.jpg',
    category:3,*/

    /*name:'Vòng cổ',
    price:2000000,
    description:"Vòng cổ lạ, đẹp",
    thumbnail: 'assets/img/f.jpg',
    category:4,*/
    /*name:'Nhẫn kim cương 2',
    price:34000000,
    description:"Nhẫn kim cương chất lượng cao",
    thumbnail: 'assets/img/g.jpg',
    category:3,*/
    /*name:'Nhẫn kim cương 3',
    price:35000000,
    description:"Nhẫn kim cương chất lượng cao",
    thumbnail: 'assets/img/h.jpg',
    category:3,*/
    /*name:'Vòng cổ đôi',
    price:4000000,
    description:"Vòng cổ lạ, đẹp",
    thumbnail: 'assets/img/i.jpg',
    category:4,*/
      name:'Nhẫn lam ngọc',
      price:30000000,
      description:"Nhẫn lam ngọc đẹp, quý phái",
      thumbnail: 'assets/img/j.jpg',
      category:3,
  });
  newProduct.save((err)=>{
    if(err)
    {
      res.json({
        result:'failed',
        data:{},
        message:'Error is: ${err}'
      });

    }else{
      res.json({
        result:'ok',
        data:{
          /*name:'Đồng hồ vàng',
          price:22000000,
          description:"Đồng hồ vàng chất lượng cao",
          thumbnail: 'assets/img/a.jpg',
          category:1,*/
          /* name:'Vòng vàng',
           price:12000000,
           description:"Vòng vàng chất lượng cao",
           thumbnail: 'assets/img/b.jpg',
           category:2,*/
          /*name:'Vòng tay',
          price:9000000,
          description:"Vòng tay đẹp",
          thumbnail: 'assets/img/c.jpg',
          category:2,*/
          /*name:'Vòng kim cương',
          price:22000000,
          description:"Vòng kim cương chất lượng cao",
          thumbnail: 'assets/img/d.jpg',
          category:2,*/
          /*name:'Nhẫn kim cương',
          price:30000000,
          description:"Nhẫn kim cương chất lượng cao",
          thumbnail: 'assets/img/e.jpg',
          category:3,*/

          /*name:'Vòng cổ',
          price:2000000,
          description:"Vòng cổ lạ, đẹp",
          thumbnail: 'assets/img/f.jpg',
          category:4,*/
          /*name:'Nhẫn kim cương 2',
          price:34000000,
          description:"Nhẫn kim cương chất lượng cao",
          thumbnail: 'assets/img/g.jpg',
          category:3,*/
          /*name:'Nhẫn kim cương 3',
          price:35000000,
          description:"Nhẫn kim cương chất lượng cao",
          thumbnail: 'assets/img/h.jpg',
          category:3,*/
          /*name:'Vòng cổ đôi',
          price:4000000,
          description:"Vòng cổ lạ, đẹp",
          thumbnail: 'assets/img/i.jpg',
          category:4,
            message:'Insert new product successfully'*/
            name:'Nhẫn lam ngọc',
            price:20000000,
            description:"Nhẫn lam ngọc đẹp, quý phái",
            thumbnail: 'assets/img/j.jpg',
            category:3,
            message:'Insert new product successfully'
        }
      });
    }
  })
});

///     CATEGORY ROUTES     ///

/*// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get('/category/create', category_controller.category_create_get());

// POST request for creating Category.
router.post('/category/create', category_controller.category_create_post());

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get());

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post());

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get());

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post());

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail());

// GET request for list of all Category .
router.get('/category', category_controller.category_list());*/

//insert category
/*router.post('/insert_new_category', function(req, res, next) {
  const newCategory=new category({
    /!*category_id:2,
    name: 'Vòng tay',
    description:'Vòng tay'*!/
    /!*category_id:3,
    name: 'Nhẫn',
    description:'Nhẫn'*!/
    /!*category_id:4,
    name: 'Vòng cổ',
    description:'Vòng cổ'*!/

  });
  newCategory.save((err)=>{
      if(err)
      {
          res.json({
              result:'failed',
              data:{},
              message:'Error is: ${err}'
          });

      }else{
          res.json({
              result:'ok',
              data:{
                /!*category_id:2,
                name: 'Vòng tay',
                description:'Vòng tay',*!/
                /!*category_id:3,
                name: 'Nhẫn',
                description:'Nhẫn',*!/
               /!* category_id:4,
                name: 'Vòng cổ',
                description:'Vòng cổ',*!/
                  message:'Insert new product successfully'
              }
          });
      }
  })
});*/

module.exports = router;
