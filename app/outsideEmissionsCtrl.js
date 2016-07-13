angular.module('myApp').controller('outsideEmissionsCtrl', ['$scope', '$http', function ($scope, $http) {
      $http.get('data/outsideEmissions.json')
         .then(function(res){
            $scope.outsideData = res.data; 
            console.log('outside');
          });
  }]);



