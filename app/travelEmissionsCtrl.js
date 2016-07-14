angular.module('myApp').controller('travelEmissionsCtrl', ['$scope', '$http', function ($scope, $http) {
      // $http.get('data/travelEmissions.json')
      //    .then(function(res){
      //       $scope.myData = res.data; 
      //       console.log(res.data);
      //       // $scope.outsideData = res.data;
      //     });

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
         		// console.log(travelData);

         		if (outsideActivities.indexOf(res.data[i].name) > -1){
         			outsideData.push(res.data[i]);
         		}

         		totalData.push(res.data[i]);
         	}

         	$scope.travelData=travelData;
            $scope.outsideData=outsideData;
         	$scope.totalData=totalData;
	
			// console.log($scope.travelData);
			// console.log($scope.outsideData);
			// console.log(totalData);

         	// var travelData = [];
         	// for (i=0; i < 9; i++){
         	//     travelData.push(res.data[i]);
         	// }

         	// $scope.travelData = travelData;

         	// var outsideData = [];
          //   for (i=9; i < 19; i++){
         	//     outsideData.push(res.data[i]);
         	// }

         	// $scope.outsideData = outsideData;

          //   // $scope.outsideData = res.data;
          // });
      // $http.get('data/outsideEmissions.json')
      //    .then(function(res){
      //       $scope.outsideData = res.data; 
          });


  }]);



