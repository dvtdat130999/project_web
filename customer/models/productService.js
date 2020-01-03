var product = require('../databasemodel/products');
var category=require('../databasemodel/categories');
const Comment=require('../databasemodel/comments');
const cart=require('../databasemodel/cart');
var async = require('async');
const mongoose = require('mongoose');

//?
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

//CREATE-none

//READ
exports.getProductsByCategory = async function(category){
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
    let result=await product.find({category: type});
    return result;
}

exports.getProductsByTrademark = async function(trademark){
    var type;
    switch (trademark)
    {
        case 'luxury' : {
            type = 1;
            break;
        }
        case 'pnj' : {
            type = 2;
            break;
        }
        case 'doji' : {
            type = 3;
            break;
        }
        case 'sjc' : {
            type = 4;
            break;
        }
        default : {
            type = 0;
        }
    }

    return await product.find({trademark: type});
}

exports.getProductsBySex = async function(sex){
    var type;
    switch (sex)
    {
        case 'male' : {
            type = 1;
            break;
        }
        case 'female' : {
            type = 2;
            break;
        }
        default : {
            type = 0;
        }
    }

    return await product.find({sex: type});
}

exports.getProductsByColor = async function(color){
    var type;
    switch (color)
    {
        case 'yellow' : {
            type = 1;
            break;
        }
        case 'white' : {
            type = 2;
            break;
        }
        case 'violet' : {
            type = 3;
            break;
        }
        case 'blue' : {
            type = 4;
            break;
        }
        default : {
            type = 0;
        }
    }

    return await product.find({color: type});
};

exports.getProductById = (id) => {
    return product.find({_id: new mongoose.Types.ObjectId(id)});
};

exports.getAllProducts = async function() {
    return await product.find();
};

exports.getCommentsOfProduct=async function(ID_product){
    return await Comment.find({product_id: ID_product});
};

exports.getCartOfUser=async function(username){
    return await cart.find({user: username});
};

//UPDATE
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

//DELETE-none

