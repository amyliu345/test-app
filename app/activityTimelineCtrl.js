angular.module('myApp').controller('activityTimelineCtrl', ['$scope', '$http', function ($scope, $http) {

   $http.get('data/activityTimeline.json')
       .then(function(res){
          var activityData = [];

          for (var i = 0; i < res.data.length; i++){
              activityData.push(res.data[i]);
          }

          $scope.activityData=activityData;

        });


}]);
