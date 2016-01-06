var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var fs = require("fs")
var comments = {}
/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err,row){
        if(err){
            res.send(err);
        }else{
            res.send({resCode:200,data:row,status:true});
        }
    });
});
function CurrentDate(CurrentDate) {

    CurrentDate = new Date(parseInt(CurrentDate));
    CurrentDate.setHours(CurrentDate.getHours())
    var current_date = CurrentDate.getDate();
    var current_month = CurrentDate.getMonth() + 1; //Months are zero based
    var current_year = CurrentDate.getFullYear();
    current_year = (current_year).toString()
    var current_Hours = CurrentDate.getHours();
    var current_minutes = CurrentDate.getMinutes();
    var current_seconds = CurrentDate.getSeconds();
    if (current_Hours<10){
        current_Hours = "0"+current_Hours
    }
    if (current_minutes<10){
        current_minutes = "0"+current_minutes
    }
    if (current_seconds<10){
        current_seconds = "0"+current_seconds
    }
    if (current_date<10){
        current_date = "0"+current_date
    }

    if (current_month<10){
        current_month = "0"+current_month
    }
    var date = ( current_date + "-" + current_month + "-" + current_year + " " + current_Hours + ":" + current_minutes + ":" + current_seconds);

    return date;
}//returns current date and time
router.post('/', function(req,res,next){
    if(req.body){
        var obj = JSON.parse(req.body.formdata);

        checkingImage(function (image) {
            if(image){
                obj['image']=image
            }
            var product = new Product(obj);
            product.save(function (err, pro) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({resCode: 200, data: pro, status: true});
                }
            });
        })
    }else{
        res.send({error:'please send product info'});
    }
    function checkingImage(callBack){
        if (req.files) {
            console.log(JSON.stringify(req.files.image))
            var file = req.files;
            var image = '';
            for (var key in file) {
                if (file.hasOwnProperty(key)) {
                    image = key;
                    break;
                }
            }
            if (image != "") {

                fs.readFile(req.files[image].path, function (err, data) {
                    var fileName = (new Date().getTime()) + '.' + req.files[image].name.split('.').pop();
                    var fileURL =  '/images/' + fileName;
                    var newPath = __dirname + "/../public/images/" + fileName;
                    console.log(newPath)
                    fs.writeFile(newPath, data, function (err) {

                        callBack(fileURL);
                    })

                })
            }else{
                callBack(false)

            }

        }else{
            callBack(false)
        }


    }
});

router.post('/comments/:id', function(req,res,next){
    if(req.body){
        var obj = req.body;
        obj['dated'] =  CurrentDate(new Date().getTime());
        if(!comments[req.params.id]){
            comments[req.params.id]=[]
        }
        comments[req.params.id].push(obj)
        console.log(JSON.stringify(req.body))
        res.send(comments[req.params.id])

    }else{
        res.send({error:'please send product info'});
    }

});


router.delete('/:id', function(req,res,next){
    Product.remove({_id:req.params.id}, function(err,item){
        if(err){
            res.send(err);
        }else{
            res.send({resCode:200, message:'product successfully deleted',data:item});
        }
    });
});


router.put('/:id', function(req,res){
    var pro = req.body;
    Product.findByIdAndUpdate(req.params.id,{$set:pro}, function(err,product){
        if(err){
            res.send(err);
        }else{
            res.send({resCode:200, message:'product successFully updated',data:product});
        }
    });
});
router.get('/:id', function(req,res){
    console.log(req.params.id)
    Product.findOne({_id:req.params.id}, function(err, product){

        if(err){
            res.send(err);
        }else{
            console.log(JSON.stringify(product))
            res.send({resCode:200, message:'product found',data:product,comments:comments[req.params.id]});
        }
    })
});


module.exports = router;