/**
 * Created by Ahmer on 11/26/2015.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/categories');

router.get('/', function(req, res, next) {
    Category.find(function(err,row){
        if(err){
            res.send(err);
        }else{
            res.send({resCode:200,data:row,status:true});
        }
    });
});

router.post('/', function(req,res,next){

    if(req.body){

        var category = new Category(req.body);
        category.save(function(err, pro){
            if(err){
                res.send(err);
            }else{
                res.send({resCode:200,data:pro,status:true});
            }
        });
    }else{
        res.send({error:'please send product info'});
    }
});
module.exports= router;