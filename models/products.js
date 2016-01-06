var mongoose = require('mongoose');


var Products = new mongoose.Schema({
    name :{type:String,required:true},
    price:{type:String,required:true},
    tax :{type:String,required:true},
    category:{_id:String,name:String},
    minQuantity:Number,
    maxQuantity :Number,
    image:String,
    markup:String
});

module.exports = mongoose.model('products',Products);