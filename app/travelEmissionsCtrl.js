angular.module('myApp').controller('travelEmissionsCtrl', ['$scope', '$http', function ($scope, $http) {

     $http.get('data/emissions.json')
         .then(function(res){
         	var travelData = [];
         	var outsideData = [];
         	var totalData = [];

         	var travelActivities = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
         	var outsideActivities = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer"]
         	
         	for (var i = 0; i < res.data.length; i++){
         		if (travelActivities.indexOf(res.data[i].name) > -1){
         			travelData.push(res.data[i]);
         		}

         		if (outsideActivities.indexOf(res.data[i].name) > -1){
         			outsideData.push(res.data[i]);
         		}

         		totalData.push(res.data[i]);
         	}

         	$scope.travelData=travelData;
            $scope.outsideData=outsideData;
         	$scope.totalData=totalData;

          });


   $http.get('data/activityTimeline.json')
       .then(function(res){
          var activityData = [];

          for (var i = 0; i < res.data.length; i++){
              activityData.push(res.data[i]);
          }

          $scope.activityData=activityData;

        });


  }]);



