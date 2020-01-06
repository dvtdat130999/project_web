const product = require('../databasemodel/products');
const productService = require('../models/productService');
var async = require('async');
const util = require('util');
var mongoose=require('mongoose');

const Formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dofdj0lqd',
    api_key: '812485548823499',
    api_secret: 'XFRmX3nAfmjO2Mvv2ynvfPfpm8s'
});

exports.getProducts = async (req, res, next) => {
    const search = req.query.search;
    if (typeof search === "undefined") {
        const id = req.query.id;
        if (typeof id !== "undefined") {
            const data = await productService.getProductById(id);

            const nameProduct = data.nameProduct;
            const price = data.price;
            const description = data.description;
            const thumbnail = data.thumbnail;
            const category = data.category;
            const quantity = data.quantity;
            const sex = data.sex;
            const trademark = data.trademark;
            const color = data.color;

            res.render('updateproduct', {
                userdata: req.user,
                id: id,
                nameProduct: nameProduct,
                price: price,
                description: description,
                thumbnail: thumbnail,
                category: category,
                quantity: quantity,
                sex: sex,
                trademark: trademark,
                color: color,
                active: "product"
            });

        } else {
            let idshop = req.query.shop;

            if (typeof idshop === "undefined")
                idshop = req.user.id;

            const data = await product.find({idshop: idshop});
            res.render('products', {userdata: req.user, products: data, active: "product"});
        }
    } else {
        const data = await product.find({idshop: req.user.id});
        const listProduct = [];

        for(const element of data){
            const nameProduct = element.name.toLowerCase();

            if(nameProduct.search(search.toLowerCase()) >= 0){
                listProduct.push(element);
            }
        }

        res.render('products', {userdata: req.user, products: listProduct, active: "product"});
    }
}

exports.getUpload = (req, res, next)=>{
    if(req.user.author === 'shop')
        res.render('newproduct', {userdata: req.user, active: "upload"});
    else
        res.redirect('/');
}

exports.postUpload = async (req, res, next)=> {
    const form = new Formidable();

    form.parse(req, (err, fields, files) => {
        const name = fields.name;
        const description = fields.description;
        const price = fields.price;
        const quantity = fields.quantity;

        let category = 1;
        switch (fields.category.toLowerCase()) {
            case 'đồng hồ':
                category = 1;
                break;
            case 'vòng tay':
                category = 2;
                break;
            case 'nhẫn':
                category = 3;
                break;
            case 'vòng cổ':
                category = 4;
                break;
            default:
                category = 0;
        }

        let color = 1;
        switch (fields.color.toLowerCase()) {
            case 'vàng':
                color = 1;
                break;
            case 'trắng':
                color = 2;
                break;
            case 'tím':
                color = 3;
                break;
            case 'xanh dương':
                color = 4;
                break;
            default:
                color = 0;
        }

        let trademark;
        switch (fields.trademark.toLowerCase()) {
            case 'skymond luxury':
                trademark = 1;
                break;
            case 'pnj':
                trademark = 2;
                break;
            case 'doji':
                trademark = 3;
                break;
            case 'sjc':
                trademark = 4;
                break;
            default:
                trademark = 0;
        }

        let sex;
        switch (fields.sex.toLowerCase()) {
            case 'nam':
                sex = 1;
                break;
            case 'nữ':
                sex = 2;
                break;
            default:
                sex = 3;
        }

        const uriDetail = "/products";
        const idshop = req.user.id;


        cloudinary.uploader.upload(files.thumbnail.path, (error, result) => {
            const thumbnail = result.url;
            const newproduct = new product({name, price, description, thumbnail, category, quantity, sex, trademark, color, uriDetail, idshop});
            newproduct.uriDetail = "/products?id=" + newproduct.id;
            newproduct.save();
            req.flash('success_msg', 'Thêm sản phẩm thành công');
            res.redirect('/products/upload');
        });


    });
};

exports.postUpdate = (req, res, next) =>{
    const form = new Formidable();

    form.parse(req, async (err, fields, files) => {
        const id = fields.id;
        const name = fields.name;
        const description = fields.description;
        const price = fields.price;
        const quantity = fields.quantity;

        let category = 1;
        switch (fields.category.toLowerCase()) {
            case 'đồng hồ':
                category = 1;
                break;
            case 'vòng tay':
                category = 2;
                break;
            case 'nhẫn':
                category = 3;
                break;
            case 'vòng cổ':
                category = 4;
                break;
            default:
                category = 0;
        }

        let color = 1;
        switch (fields.color.toLowerCase()) {
            case 'vàng':
                color = 1;
                break;
            case 'trắng':
                color = 2;
                break;
            case 'tím':
                color = 3;
                break;
            case 'xanh dương':
                color = 4;
                break;
            default:
                color = 0;
        }

        let trademark;
        switch (fields.trademark.toLowerCase()) {
            case 'skymond luxury':
                trademark = 1;
                break;
            case 'pnj':
                trademark = 2;
                break;
            case 'doji':
                trademark = 3;
                break;
            case 'sjc':
                trademark = 4;
                break;
            default:
                trademark = 0;
        }

        let sex;
        switch (fields.sex.toLowerCase()) {
            case 'nam':
                sex = 1;
                break;
            case 'nữ':
                sex = 2;
                break;
            default:
                sex = 3;
        }
        const productEdit = await product.findOne({_id: new mongoose.Types.ObjectId(id)});

        productEdit.name = name;
        productEdit.price = price;
        productEdit.description = description;
        productEdit.quantity = quantity;
        productEdit.sex = sex;
        productEdit.category = category;
        productEdit.color = color;
        productEdit.trademark = trademark;

        //Kiểm tra xem người dùng có tải hình mới lên hay không
        if(files.thumbnail.name !== ''){
            cloudinary.uploader.upload(files.thumbnail.path, (error, result) => {
                const thumbnail = result.url;
                productEdit.thumbnail = thumbnail;
                productEdit.save();
                req.flash('success_msg', 'Chỉnh sử thông tin sản phẩm thành công');
                res.redirect('/products');
            });
        }
        else
        {
            productEdit.save();
            req.flash('success_msg', 'Chỉnh sử thông tin sản phẩm thành công');
            res.redirect('/products');
        }

    });
};
////////////////////////////////////////////////////////////////////////////