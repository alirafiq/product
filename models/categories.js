/**
 * Created by Ahmer on 11/26/2015.
 */
var mongoose = require('mongoose');

var Categories = new mongoose.Schema({
   name :{type:String,required:true},
   description:String
});

module.exports = mongoose.model('categories',Categories);