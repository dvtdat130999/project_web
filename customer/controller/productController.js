const product = require('../databasemodel/products');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = (req, res, next) =>  res.render('index', { userdata:req.user });

exports.getCart = (req, res, next) => res.render('cart', { userdata:req.user });

exports.getShip = (req, res, next) => res.render('ship', { userdata:req.user });

exports.getProduct = (req, res, next) => {
    let page=req.query.page;
    let arr=[];
    let condition="";

    //hàm tạo ra mảng 2 chiều sản phẩm
    const pageElementsArr = function (arr, eleDispCount) {
        const arrLen = arr.length;
        const noOfPages = Math.ceil(arrLen / eleDispCount);
        let pageArr = [];
        let perPageArr = [];
        let index = 0;
        let condition = 0;
        let remainingEleInArr = 0;

        for (let i = 0; i < noOfPages; i++) {

            if (i === 0) {
                index = 0;
                if (arrLen>=eleDispCount)
                {
                    condition = eleDispCount;
                }
                else
                {
                    condition=arrLen;
                }
            }
            for (let j = index; j < condition; j++) {
                perPageArr.push(arr[j]);
            }
            pageArr.push(perPageArr);
            if (i === 0) {
                remainingEleInArr = arrLen - perPageArr.length;
            } else {
                remainingEleInArr = remainingEleInArr - perPageArr.length;
            }

            if (remainingEleInArr > 0) {
                if (remainingEleInArr > eleDispCount) {
                    index = index + eleDispCount;
                    condition = condition + eleDispCount;
                } else {
                    index = index + perPageArr.length;
                    condition = condition + remainingEleInArr;
                }
            }
            perPageArr = [];
        }
        return pageArr;
    }

    //Sort products
    const softby=req.query.sort;
    if (softby==="low")
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                list_products.sort(function(a,b){
                    return  parseInt(a.price,10)-parseInt(b.price,10);
                });
                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,3);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                condition="&sort=low";
                res.render('products/list', { product_list: array2D[index],userdata:req.user, active: arr, condition: condition});
            });
        return;
    }
    else if(softby==="high")
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                list_products.sort(function(a,b){
                    return parseInt(b.price,10)-parseInt(a.price,10);
                });

                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,3);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }
                condition="&sort=high";
                res.render('products/list', { product_list: array2D[index],userdata:req.user, active: arr, condition: condition  });
            });
        return;
    }

    //category product
    const category = req.query.category;
    if(typeof category !== "undefined")
    {
        const id = req.query.id;
        if(typeof id !== "undefined")
        {
            productService.getProductById(id)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/productdetail', { title: 'Diamond ring 2', product_list: list_products ,userdata:req.user, active: arr, condition: condition });
                });
        }
        else
        {
            productService.getProductsByCategory (category)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    if (typeof page==="undefined"){
                        page="1";
                    }
                    let index=parseInt(page,10)-1;
                    let array2D = pageElementsArr(list_products,3);
                    for (i=0;i<array2D.length;i++)
                    {
                        arr[i]="";
                    }
                    arr[index]="class=active";
                    if (typeof array2D[index]==="undefined")
                    {
                        array2D[index]=[];
                    }
                    condition="&category="+category;
                    res.render('products/list', { title: 'Watch List', product_list: array2D[index],userdata:req.user, active: arr, condition: condition });
                });
        }
    }
    else
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                if (typeof page==="undefined"){
                    page="1";
                }
                let index=parseInt(page,10)-1;
                let array2D = pageElementsArr(list_products,3);
                for (i=0;i<array2D.length;i++)
                {
                    arr[i]="";
                }
                arr[index]="class=active";
                if (typeof array2D[index]==="undefined")
                {
                    array2D[index]=[];
                }

                res.render('products/list', { product_list: array2D[index],userdata:req.user, active: arr, condition: condition });
            });
    }
}

exports.getStatus = (req, res, next) => res.render('status_products', {userdata:req.user});

exports.getAdvanced = (req, res, next) => res.render('advanced_searching',{userdata:req.user});

////////////////////////////////////////////////////////////////////////////