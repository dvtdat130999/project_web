var mongoose=require('mongoose');

var commentSchema=new mongoose.Schema({
    product_id:{
        type:String,
    },
    userName:{
        type:String,
    },
    time:{
        type:Date,
    },
    content:{
        type:String,
    },
});

module.exports=mongoose.model('comment',commentSchema);