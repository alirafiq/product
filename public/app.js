/**
 * Created by Ahmer on 11/26/2015.
 */
var app = angular.module('app',['ui.router','ngMessages']);

app.config(function($stateProvider, $urlRouterProvider){
   $stateProvider
       .state('product',{
       url:'/',
       templateUrl:'templates/list-products.client.view.html',
       controller:'product'
       })
       .state('addProduct',{
        url:'/addProduct',
        templateUrl:'templates/create-product.client.view.html',
        controller:'addProduct'
        })
       .state('showProduct',{
           url:'/product/{id}',
           templateUrl:'templates/showProduct.html',
           controller:'showProduct'
       })
       .state('editProduct', {
           url:'/editProduct/{id}',
           templateUrl:'templates/create-product.client.view.html',
           controller:'addProduct'
       })
       .state('addCategory',{
           url:'/addCategory',
           templateUrl:'templates/add-category.html',
           controller:'addCategory'
       })
       .state('category',{
           url:'/category',
           templateUrl:'templates/list-category.html',
           controller:'category'
       })
       .state('viewProdct',{
           url:'/product',
           templateUrl:'templates/products.html',
           controller:'viewProducts'
       })
       $urlRouterProvider.otherwise('/');

});

app.controller("viewProducts",function($scope,$http){
    $scope.title = 'Show Products';
    $scope.products=[];
    $http.get('/product')
        .success(function(data){
            $scope.products = data.data;
        })
        .error(function(err){
            alert(err);
        });
})

app.controller("showProduct",function($scope,$http,$stateParams){
    $scope.title = 'Show Products';

    $http.get('/product/'+$stateParams.id)
        .success(function(data){
            $scope.products = data.data;
            console.log(JSON.stringify(data.comments))
            $scope.comments = data.comments

        })
        .error(function(err){
            alert(err);
        });
    $scope.addComments = function(item, isValid){
            $http.post('/product/comments/'+$stateParams.id,item)
                .success(function(data){
                    $scope.comments = data;

                    $scope.desc = '';
                })
                .error(function(err){
                    alert(err);
                })

};
});

app.controller('product', function($scope, $http){
    $scope.title = 'Show Products';
    $scope.products=[];
    $http.get('/product')
        .success(function(data){
            $scope.products = data.data;
        })
        .error(function(err){
            alert(err);
        });

    $scope.delete = function(id){
        $http.delete('/product/'+id)
            .success(function(data){
                console.log(data);
                $http.get('/product')
                    .success(function(data){
                        $scope.products = data.data;
                    })
                    .error(function(err){
                        alert(err);
                    });
                alert('item succussFully deleted');
            })
            .error(function(err){
               alert(err)
            });
    }
});

app.controller('addProduct', function($scope, $http, $location, $stateParams){
    $scope.title = 'Show Products';
    $scope.products=[];
    $scope.categoriesList = [];
    $http.get('/category')
        .success(function(cate){
            $scope.categoriesList = cate.data;
        })
        .error(function(err){
            alert(err);
        });

    if($stateParams.id){
        $http.get('/product/'+$stateParams.id)
            .success(function(data){
                $scope.product = data.data;
            })
            .error(function(err){
                alert(err);
            })
        $scope.addProduct = function(item, isValid){
            if(isValid){
                var obj  = item;
                //  obj['category'] = JSON.parse(item.category);
                $http.put('/product/'+$stateParams.id,obj)
                    .success(function(data){
                        if(data.errors){
                            alert(data.message);
                            $scope.error = true;
                        }else{
                            alert('product successfully updated');
                            $location.path('/')
                        }
                    })
                    .error(function(err){
                        alert(err);
                    });
            }else{
                alert('please enter value values');
            }
        };

    }else{
        $http.get('/category')
            .success(function(cate){
                $scope.categoriesList = cate.data;
            })
            .error(function(err){
                alert(err);
            });
        $scope.addProduct = function(item,isValid ){
            if(isValid){
                var fd=new FormData();
                angular.forEach($scope.image,function(file){
                    fd.append('image',file);
                });

                fd.append('formdata',JSON.stringify($scope.product));

                $http.post('/product',fd,{
                    transformRequest:angular.identity,
                    headers:{'Content-type':undefined}
                }).success(function(data){
                    alert('product successfully added');
                    $location.path('/')
                });

            }else{
                alert('please enter value values');
            }
        };
    }


});

app.directive("fileInput",['$parse',function($parse){
    return{
        restrict:'A',
        link:function(scope,ele,attrs){
            ele.bind('change',function(){
                $parse(attrs.fileInput).
                    assign(scope,ele[0].files)
                scope.$apply()
            });
        }
    }
}]);
app.controller('category', function($scope, $http){
    $scope.title = 'Show category';
    $scope.categories=[];
    $http.get('/category')
        .success(function(data){
            $scope.categories = data.data;
        })
        .error(function(err){
            alert(err);
        })
});

app.controller('addCategory', function($scope, $http, $location){
    $scope.title = 'Show Category';
    $scope.addProduct = function(item, isValid){
        if(isValid){
            $http.post('/category',item)
                .success(function(data){
                    if(data.errors){
                        alert(data.message);
                    }else{
                        alert('category successfully add');
                        $location.path('/category')
                    }

                })
                .error(function(err){
                    alert(err);
                })
        }else{
            alert('please enter valid values');
        }
    };
});


app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                    });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            }); //change

        } //link
    }; //return
});