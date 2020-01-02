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
    dateSale:{
        type: String
    },
    confirm:{
        type: Boolean
    }
});

module.exports=mongoose.model('order', orderSchema, 'order');