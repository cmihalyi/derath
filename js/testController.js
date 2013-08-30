//TO DO:
// get more than 1 page of data returned
// enhance layout
// content for front page
// find other feeds to tie into app like financials
// where the 404 errors are coming from for images, why more than 1
// why error when more than 1 createImgUrl() insdie for ex. ln.78
// search input refresh when navigating forwards back in browser or search input clear when search is performed
// toggle buttons instead of dropdown for search categories




var app = angular.module('MovieApp',['ngRoute', 'ngResource']);


//can only access Providers here inside config
app.config(function($routeProvider, $provide){

    //creating a routeProvider
    $routeProvider
    .when("/", {templateUrl : "home.html"})
    .when("/now", {templateUrl : "item_list.html", controller : "ViewController.getNowPlayingMovieData"})
    .when("/upcoming", {templateUrl : "item_list.html", controller : "ViewController.getUpcomingMovieData"})
    .when("/popular", {templateUrl : "item_list.html", controller : "ViewController.getPopularMovieData"})
    .when("/people", {templateUrl : "item_list.html", controller : "ViewController.getPersonData"})
    .when("/movie/:id", {templateUrl : "movie.html", controller : "ViewController.getSpecificMovieData"})
    .when("/person/:id", {templateUrl : "people.html", controller : "ViewController.getSpecificPersonData"})
    .when("/search", {templateUrl : "item_list.html", controller : "ViewController.getSearchResults"})
    .otherwise({templateUrl : "404.html"});

});


//creating a DataService
app.service("DS", function($http, $q){
    var instance = this;
    this.configObj = this.getBaseUrlData;
    
    this.getKey = function(){
        return "bcc0b5231931d089b76fbce6cb804f55";
    };

    this.getBaseUrlData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/configuration?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            console.log("getting baseURL");
            deferred.resolve(data.images);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;
    };

    this.getUpcomingMovieData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/movie/upcoming?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            console.log(data);
            for(x in data.results){
                data.results[x].poster_path = instance.createImgUrl(instance.configObj, data.results[x].poster_path);
            }        
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;
    };
    
    this.getPopularMovieData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/movie/popular?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            deferred.resolve(data);
            for(x in data.results){
                data.results[x].poster_path = instance.createImgUrl(instance.configObj, data.results[x].poster_path);
                //data.results[x].backdrop_path = instance.createImgUrl(instance.configObj, data.results[x].backdrop_path);
            }
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;
    };
    
    this.getNowPlayingMovieData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/movie/now_playing?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            for(x in data.results){
                data.results[x].poster_path = instance.createImgUrl(instance.configObj, data.results[x].poster_path);
                //data.results[x].backdrop_path = instance.createImgUrl(instance.configObj, data.results[x].backdrop_path);
            }
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;
    };
    
    this.getSpecificMovieData = function(id){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/movie/" + id + "?api_key=" + this.getKey() + "&callback=JSON_CALLBACK&append_to_response=casts,trailers,similar_movies,reviews")
        .success(function(data){
            data.poster_path = instance.createImgUrl(instance.configObj, data.poster_path);
            data.backdrop_path = instance.createImgUrl(instance.configObj, data.backdrop_path);
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;
    };
    
    this.getPersonData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/person/popular?api_key=" + this.getKey() + "&callback=JSON_CALLBACK&append_to_response=credits,images")
        .success(function(data){
            for(x in data.results){
                data.results[x].profile_path = instance.createImgUrl(instance.configObj, data.results[x].profile_path);
            }
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        console.log(deferred);
        return deferred.promise;                
    };

    this.getSpecificPersonData = function(id){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/person/" + id + "?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            data.profile_path = instance.createImgUrl(instance.configObj, data.profile_path);
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;                
    };
    
    this.getSearchResults = function(type, query){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/search/" + type + "?query=" + query + "&api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            console.log(data);
            for(x in data.results){
                if(type === "people"){
                    data.results[x].profile_path = instance.createImgUrl(instance.configObj, data.results[x].profile_path);                
                }else{
                    data.results[x].poster_path = instance.createImgUrl(instance.configObj, data.results[x].poster_path);
                    //data.results[x].backdrop_path = instance.createImgUrl(instance.configObj, data.results[x].backdrop_path);
                }
            }
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;                
    };
    
    //http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg
    this.createImgUrl = function(configObj, data){
        console.log("creating some urls");
        
        var obj = {};
        //console.log(configObj.base_url);
        //console.log(configObj.poster_sizes);
        //console.log(configObj.backdrop_sizes);
        //console.log(configObj.profile_sizes);
        //console.log(data);
        
        for(x in configObj){
            //console.log(x);
            if(x !== "base_url" && x !== "secure_base_url"){
                obj[x] = {};

                for(y in configObj[x]){
                    //TODO: need to check for a null value here
                    obj[x][configObj[x][y]] = configObj.base_url + configObj[x][y] + data;

                    //console.log(obj[x][configObj[x][y]]);
                    //console.log(configObj[x][y]);
                }
                //console.log(obj);
            }
        }

        //console.log(obj);
        return obj;
    };

});


app.directive("navigation", function(){
    return function(scope, element, attrs){
        element.bind("click", function(){
            //remove then set the active class
            element.parent().find("li").removeClass(attrs.navigation);
            element.addClass(attrs.navigation);
            console.log(attrs);
        });
    };
});


app.directive("search", function(){
    return {
        restrict : "E",
        templateUrl : "search.html",
        //this is where the behavior goes for the directive
        link : function(){
            console.log("searching");
        }
    };
});


var AppController = app.controller("AppController", function($rootScope, $route, $location, $scope, $routeParams, DS){
    console.log("======================= - AppController Start");
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;    
    
    $rootScope.$on("$routeChangeStart", function(event, current, previous, rejection){
        console.log("======================= - $routeChange Start");
        console.log(event);
        console.log(current);
        console.log(previous);
        console.log(rejection);
        console.log("======================= - $routeChange End");
    });

    $rootScope.$on("$routeChangeSuccess", function(event, current, previous, rejection){
        console.log("======================= - $routeChangeSuccess Start");
        console.log(event);
        console.log(current);
        console.log(previous);
        console.log(rejection);
        console.log("======================= - $routeChangeSuccess End");
    });

    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection){
        console.log("======================= - $routeChangeError Start");
        console.log(event);
        console.log(current);
        console.log(previous);
        console.log(rejection);
        console.log("======================= - AppController End");
    });

    DS.getBaseUrlData().then(function(data){
        DS.configObj = data;
    });

    console.log("======================= - AppController End");
});


var ViewController = app.controller("ViewController", function($rootScope, $scope, $route, $routeParams, DS, $location){
    console.log("======================= - ViewController Start");
    console.log($rootScope);
    console.log($scope);

    $scope.isActive = function(path){
        return $location.path() === path ? "active" : "";
    };

    $scope.getSearchResults = function(){
        console.log("======================= - $scope.getSearchResults Start");

        $location.path("search").search("type", $scope.search.type).search("query", $scope.search.query);

        //ViewController.getSearchResults(DS, $scope, $location);
        
        console.log("======================= - $scope.getSearchResults End");
    };
    console.log("======================= - ViewController End");
});


ViewController.getSearchResults = function(DS, $scope, $location){
    console.log("======================= - ViewController.getSearchResults Start");
    
    console.log($location.search());
    $scope.searchParams = $location.search();
    
    if($scope.searchParams.type === "movies"){
        $scope.searchParams.isMovie = "true";
    };
    
    if($scope.searchParams.type === "people"){
        $scope.searchParams.isPeople = "true";
    };
    
    console.log($scope);

    DS.getSearchResults($location.search().type, $location.search().query).then(function(data){
        $scope.movieList = data.results;
        console.log($scope.movieList);
    });
    
    console.log("======================= - ViewController.getSearchResults End");
};


ViewController.getNowPlayingMovieData = function(DS, $scope){
    console.log($scope);
    DS.getNowPlayingMovieData().then(function(data){
        $scope.movieList = data.results;
    });
};


ViewController.getUpcomingMovieData = function(DS, $scope){
    console.log($scope);
    DS.getUpcomingMovieData().then(function(data){
        $scope.movieList = data.results;
    });
};


ViewController.getPopularMovieData = function(DS, $scope){
    console.log($scope);
    DS.getPopularMovieData().then(function(data){
        $scope.movieList = data.results;
    });
};


ViewController.getPersonData = function(DS, $scope){
    console.log($scope);
    DS.getPersonData().then(function(data){
        console.log(data);
        $scope.movieList = data.results;
    });
};


ViewController.getSpecificPersonData = function(DS, $scope){
    console.log($scope.$parent.$routeParams);
    DS.getSpecificPersonData($scope.$parent.$routeParams.id).then(function(data){
        $scope.movieList = data;
    });
};


ViewController.getSpecificMovieData = function(DS, $scope){
    console.log($scope);
    console.log($scope.$parent.$routeParams);
    DS.getSpecificMovieData($scope.$parent.$routeParams.id).then(function(data){
        $scope.movieList = data;
    });
};


ViewController.fetchData = function(){
    console.log("resolving");
}

