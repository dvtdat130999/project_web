var mongoose=require('mongoose');

var orderSchema=new mongoose.Schema({
    idShop:{
        type:String
    },
    idUser:{
        type:String
    },
    idProduct:{
        type:String
    },
    nameProduct:{
        type:String
    },
    quantity:{
        type:Number
    },
    addressDelivery:{
        type:String
    },
    daySale:{
        type: Number
    },
    monthSale:{
        type: Number
    },
    yearSale:{
        type: Number
    },
    confirm:{
        type: Number
    }
});

module.exports=mongoose.model('order', orderSchema, 'order');