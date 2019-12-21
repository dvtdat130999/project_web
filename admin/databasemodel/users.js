var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    address:{
        type:String,
        required:true

    },
    phone:{
        type: Number,
        required: true
    },

    linkproducts:{
        type: String,
        required: true
    },


    created_date:{
        type:Date,
        default:Date.now()
    },

    author:{
        type:String,
        default: 'shop',
        required:true
    },
    uriDetail:{
        type:String
    },
    locked:{
        type:Boolean,
        default:false
    }

});


module.exports=mongoose.model('user',userSchema);