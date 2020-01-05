var mongoose=require('mongoose');

var productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type:String
    },
    thumbnail:{
        type:String,
        required:true
    },
    uriDetail:{
        type:String,
        required:true
    },
    idshop:{
        type: String,
        required:true
    },
    category:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    sex: {
        type: Number,
        required:true
    },
    color: {
        type: Number,
        required:true
    },
    trademark: {
        type: Number,
        required:true
    },
    status:{
        type:[{
            type:String,
            enum:['Mới','Đã hết']
        }],
        default: ['Mới']
    },
    created_date:{
        type:Date,
        default:Date.now()
    }

});
//setter
productSchema.path('name').set((inputString)=>{
    return inputString[0].toUpperCase()+inputString.slice(1);
});

module.exports=mongoose.model('product',productSchema);