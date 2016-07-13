angular.module('myApp').controller('travelEmissionsCtrl', ['$scope', '$http', function ($scope, $http) {
      $http.get('data/travelEmissions.json')
         .then(function(res){
            $scope.myData = res.data; 
          });
      $http.get('data/outsideEmissions.json')
         .then(function(res){
            $scope.outsideData = res.data; 
          });


  }]);



