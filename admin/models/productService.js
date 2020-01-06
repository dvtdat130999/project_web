var product = require('../databasemodel/products');
var category=require('../databasemodel/categories');
var async = require('async');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dofdj0lqd',
    api_key: '812485548823499',
    api_secret: 'XFRmX3nAfmjO2Mvv2ynvfPfpm8s'
});

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

// Handle product update.
exports.decreaseSumOfProduct = function(id){
    console.log("decrease hello !!");

    let sum;
    product.findOne({ _id: id })
        .then((doc) => {
            if (doc) {
                sum = doc.sum;
                if(sum < 1)
                    return false;
                sum--;
                product.update( {_id: new mongoose.Types.ObjectId(id)},{$set:{sum: sum}});

                console.log("decrease success" + sum);
                return true;
            } else {
                console.log("no data exist for this id");
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

exports.findByCategory = (category) => {
    var type;
    switch (category)
    {
        case 'watch' : {
            type = 1;
            break;
        }
        case 'bracelet' : {
            type = 2;
            break;
        }
        case 'ring' : {
            type = 3;
            break;
        }
        case 'necklaced' : {
            type = 4;
            break;
        }
        default : {
            type = 0;
        }
    }

    return product.find({category: type});
}

exports.getProductById = async (id) => {
    const productOnDB = await product.findOne({_id: id});
    const nameProduct = productOnDB.name;
    const description = productOnDB.description;
    const price = productOnDB.price;
    const quantity = productOnDB.quantity;
    let category;
    switch (productOnDB.category) {
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
    switch (productOnDB.color) {
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
    switch (productOnDB.trademark) {
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
    switch (productOnDB.sex) {
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

    const thumbnail = productOnDB.thumbnail;
    const newProduct = {
        nameProduct: nameProduct,
        price: price,
        description: description,
        thumbnail: thumbnail,
        category: category,
        quantity: quantity,
        sex: sex,
        trademark: trademark,
        color: color
    };

    return newProduct;
}

exports.insertProduct = async (fields) =>{
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
    const thumbnail = "";
    const newProduct = new product({name, price, description, thumbnail, category, quantity, sex, trademark, color, uriDetail, idshop});
    newProduct.uriDetail = "/products?id=" + newProduct.id;
    await newProduct.save();
    return newProduct;
};

