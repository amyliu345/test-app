angular.module('myApp').controller('travelEmissionsCtrl', ['$scope', '$http', function ($scope, $http) {
          var travelData = [];
          var outsideData = [];
          var totalData = [];
     $http.get('data/emissions.json')
         .then(function(res){


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
          $scope.activityData=res.data;
        });

   $http.get('data/dailyPassengers.json')
       .then(function(res){
          $scope.passengerData=res.data;
        });

   $http.get('data/dailyDistance.json')
       .then(function(res){
          $scope.distanceData=res.data;
          $scope.transitionData=$scope.distanceData;
       console.log($scope.transitionData);

        });
          // $scope.transitionData=$scope.distanceData;


       // $scope.toggle = function(dataType){
       //    $scope.transitionData=travelData;
       // }
    $scope.focusinControl = {};
    // $scope.otherfocusinControl = {};

   // $http.get('data/dailyTime.json')
   //     .then(function(res){
   //        $scope.timeData=res.data;
   //      });

   // $http.get('data/weeklyCarbonCost.csv')
   //     .then(function(res){
   //        $scope.weeklyCarbonData=res.data;
   //      });


  }]);



