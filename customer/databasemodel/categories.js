var mongoose=require('mongoose');

var categorySchema=new mongoose.Schema({
    category_id:{
        type:Number,

    },
    name:{
        type:String,
        required:true
    },

    description:{
        type:String,

    },




});

module.exports=mongoose.model('category',categorySchema);