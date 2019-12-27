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

exports.getProducts = (req, res, next) => {
    const id = req.query.id;

    if (typeof id !== "undefined") {
        productService.findById(id).exec((err, data) => {
            //res.send(util.inspect({data: data}));
            const nameproduct = data[0].name;
            const description = data[0].description;
            const price = data[0].price;
            const quantity = data[0].quantity;
            let category;
            switch (data[0].category) {
                case 1:
                    category = 'Đồng hồ';
                    break;
                case 2:
                    category = 'Vòng tay';
                    break;
                case 3:
                    category = 'Nhẫn';
                    break;
                case 4:
                    category = 'Vòng cổ';
                    break;
                default :
                    category = 'Khác';
            }

            let color;
            switch (data[0].color) {
                case 1:
                    color = 'Vàng';
                    break;
                case 2:
                    color = 'Trắng';
                    break;
                case 3:
                    color = 'Tím';
                    break;
                case 4:
                    color = 'Xanh dương';
                    break;
                default :
                    color = 'Khác';
            }

            let trademark;
            switch (data[0].trademark) {
                case 1:
                    trademark = 'Skymond Luxury';
                    break;
                case 2:
                    trademark = 'PNJ';
                    break;
                case 3:
                    trademark = 'DOJI';
                    break;
                case 4:
                    trademark = 'SJC';
                    break;
                default :
                    trademark = 'Khác';
            }

            let sex;
            switch (data[0].sex) {
                case 1:
                    sex = 'Nam';
                    break;
                case 2:
                    sex = 'Nữ';
                    break;
                default :
                    sex = 'Khác';
                    break;
            }

            const thumbnail = data[0].thumbnail;

            res.render('updateproduct', {userdata: req.user, id: id, nameproduct: nameproduct, price: price, description: description,
                thumbnail: thumbnail, category: category, quantity: quantity, sex: sex, trademark: trademark, color: color});
        });
    }
    else{
        let idshop = req.query.shop;

        if (typeof idshop === "undefined")
            idshop = req.user.id;
        product.find({idshop: idshop}).then(data => {
            res.render('products', {userdata: req.user, products: data});
        })
    }


}

exports.getUpload = (req, res, next)=>{
    if(req.user.author === 'shop')
        res.render('newproduct', {userdata: req.user});
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