var mongoose=require('mongoose');

var cartsSchema=new mongoose.Schema({
    user:{
        type: String,
    },
    amount:{
        type:Number,
    },
    listItem:{
        type:Array,
    },
});

module.exports=mongoose.model('carts',cartsSchema);