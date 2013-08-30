//TO DO:
// data calls for and incorporation of images
// wire up navigation logic
// get more than 1 page of data returned
// enhance layout
// content for front page
// find other feeds to tie into app like financials








var app = angular.module('MovieApp',['ngRoute', 'ngResource']);

//can only access Providers here inside config
app.config(function($routeProvider, $provide){

    //creating a routeProvider
    $routeProvider
    .when("/", {templateUrl : "home.html"})
    .when("/popular", {templateUrl : "movielist.html", controller : "ViewController", resolve : {loadData : ViewController.fetchData}})
    .when("/now", {templateUrl : "movielist.html", controller : "NowPlayingMovieController", resolve : {loadData : ViewController.fetchData}})
    .when("/upcoming", {templateUrl : "movielist.html", controller : "UpcomingMovieController", resolve : {loadData : ViewController.fetchData}})
    .when("/people", {templateUrl : "peoplelist.html", controller : "PersonController", resolve : {loadData : ViewController.fetchData}})
    .when("/movie/:id", {templateUrl : "movie.html", controller : "SpecificMovieController", resolve : {loadData : ViewController.fetchData}})
    .when("/people/:id", {templateUrl : "people.html", controller : "SpecificPersonController", resolve : {loadData : ViewController.fetchData}})
    .when("/search/people", {templateUrl : "search_people.html", resolve : {loadData : ViewController.fetchData}})
    .when("/search/movies", {templateUrl : "search_movies.html", resolve : {loadData : ViewController.fetchData}})
    .otherwise({templateUrl : "404.html"});

});


//creating a DataService
app.service("DS", function($http, $q){

    this.getKey = function(){
        return "bcc0b5231931d089b76fbce6cb804f55";
    };

    this.getBaseUrlData = function(){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/configuration?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
            deferred.resolve(data.images.base_url);
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
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;                
    };
    
    this.getSpecificPersonData = function(id){
        var deferred = $q.defer();
        $http.jsonp("http://api.themoviedb.org/3/person/" + id + "?api_key=" + this.getKey() + "&callback=JSON_CALLBACK")
        .success(function(data){
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
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;                
    };
    
    //http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg
    this.getImgData = function(baseUrl, size, filePath){
        var deferred = $q.defer();
        $http.get(baseUrl + size + filePath)
        .success(function(data){
            deferred.resolve(data);
        })
        .error(function(error){
            deferred.reject("and error occurred during ajax call fetching data");
        });
        return deferred.promise;                
    };
});


app.directive("navigation", function(){
    return function(scope, element, attrs){
        element.bind("click", function(){
            //remove then set the active class
            element.parent().find("li").removeClass(attrs.navigation);
            element.addClass(attrs.navigation);
        });
    };
});


app.directive("search", function(){
    return {
        restrict : "E",
        templateUrl : "search.html",
        //this is where the behavior goes for the directive
        link : function(){
            
        }
    }
});


var AppController = app.controller("AppController", function($rootScope, $route, $location, $scope, $routeParams, DS){
    console.log("=======================");
    console.log("AppController");
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;    
    
    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection){
        console.log("failed to change route");
    });

    DS.getBaseUrlData().then(function(data){
       console.log(data); 
    });

    console.log("=======================");
});


var NowPlayingMovieController = app.controller("NowPlayingMovieController", function($scope, $http, $route, $routeParams, DS){
    console.log("=======================");
    console.log("NowPlayingMovieController");
    console.log($scope);
    
    DS.getNowPlayingMovieData().then(function(data){
        $scope.movieList = data.results;
    });    

    console.log("=======================");
});


var UpcomingMovieController = app.controller("UpcomingMovieController", function($scope, $route, $routeParams, DS){
    console.log("=======================");
    console.log("UpcomingMovieController");
    console.log($scope);
    
    DS.getUpcomingMovieData().then(function(data){
        $scope.movieList = data.results;
    });

    console.log("=======================");
});


var PopularMovieController = app.controller("PopularMovieController", function($scope, $http, $route, $routeParams, DS){
    console.log("=======================");
    console.log("PopularMovieController");
    console.log($scope);
    

    DS.getPopularMovieData().then(function(data){
        $scope.movieList = data.results;
    });

    console.log("=======================");
});


var PersonController = app.controller("PersonController", function($scope, $http, $route, $routeParams, DS){
    console.log("=======================");
    console.log("PersonController");
    console.log($scope);
    

    DS.getPersonData().then(function(data){
        $scope.movieList = data.results;
    })

    console.log("=======================");
});


var SpecificPersonController = app.controller("SpecificPersonController", function($scope, $http, $route, $routeParams, DS){
    console.log("=======================");
    console.log("SpecificPersonController");
    console.log($scope);
    console.log($routeParams);

    DS.getSpecificPersonData($routeParams.id).then(function(data){
        $scope.movieList = data;
    })

    console.log("=======================");
});


var SpecificMovieController = app.controller("SpecificMovieController", function($scope, $http, $route, $routeParams, DS){
    console.log("=======================");
    console.log("SpecificMovieController");
    console.log($scope);
    console.log($routeParams);

    DS.getSpecificMovieData($routeParams.id).then(function(data){
        $scope.movieList = data;
    })

    console.log("=======================");
});


var ViewController = app.controller("ViewController", function($scope, $route, $routeParams, DS, $location){
    console.log("=======================");
    console.log("ViewController");
    console.log($scope);
    $scope.search = {};
    $scope.search.query = "";    
    $scope.search.type = "movies";

    $scope.isActive = function(){
        return {"active" : true}
    };

    $scope.getPopularMovieData = function(){
        DS.getPopularMovieData().then(function(data){
            $scope.movieList = data.results;
        });
    };

    $scope.getNowPlayingMovieData = function(){
        DS.getNowPlayingMovieData().then(function(data){
                $scope.movieList = data.results;
        });        
    };

    $scope.getUpcomingMovieData = function(){
        DS.getUpcomingMovieData().then(function(data){
            $scope.movieList = data.results;
        });
    };
    
    $scope.getPersonData = function(){
        DS.getPersonData().then(function(data){
            $scope.movieList = data.results;
        });    
    };

    $scope.getSpecificPersonData = function($routeParams.id){
        DS.getSpecificPersonData($routeParams.id).then(function(data){
            $scope.movieList = data;
        });    
    };

    $scope.getSpecificMovieData = function($routeParams.id){
        DS.getSpecificMovieData($routeParams.id).then(function(data){
            $scope.movieList = data;
        });
    };
    
    $scope.getSearchResults = function(){
        DS.getSearchResults($scope.search.type, $scope.search.query).then(function(data){
            $scope.movieList = data.results;
            console.log($scope.movieList);
            $location.path("search/" + $scope.search.type);
        });
    };

    console.log("=======================");
});


ViewController.fetchData = function($q, $timeout, $location){
    var defer = $q.defer();
    
    console.log($location.path());
    console.log($location);
    
    $timeout(function(){
        defer.resolve("data fetched");
        console.log("data fetched");
    }, 500);

    return defer.promise;
}