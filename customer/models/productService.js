var product = require('../databasemodel/products');
var category=require('../databasemodel/categories');
var async = require('async');
const mongoose = require('mongoose');

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

exports.findById = (id) => {
    return product.find({_id: new mongoose.Types.ObjectId(id)})
}