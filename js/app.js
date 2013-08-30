/*
var app = angular.module('MovieApp',[]);

app.factory("Data", function(){
    return {message: "I'm data from a service"};
});

app.filter('movieFilter', function(){

});
app.service("dataService", function(){
    //add configuration for data queries and responses
    this.getMovieData = function(media, cat, title){
        $http.jsonp("http://api.themoviedb.org/3/" + media + "/" + cat + "?api_key=" + $scope.api_key + "&callback=JSON_CALLBACK")
        .success(function(data){
            console.log(data);
            
            $scope.results.length = 0;
            $scope.title = title;
            angular.forEach(data.results, function(data, index){
                $scope.results.push(data);
            });
            
            return data;
        })
        .error(function(error){
            console.log(error);
        });        
    };
});

*/