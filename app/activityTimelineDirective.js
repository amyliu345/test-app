
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
angular.module('myApp')

.directive('activityTimeline', function () {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     return {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         //replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: { data: '=chartData',
                  title: '@chartTitle',
                  legend:'='},
         link: function (scope, element, attrs) {
            scope.$watch('data', function(){

              var testDataWithColorPerTime = scope.data;
                
              function msToTime(s) {

                  var ms = s % 1000;
                  s = (s - ms) / 1000;
                  var secs = s % 60;
                  s = (s - secs) / 60;
                  var mins = s % 60;
                  var hrs = (s - mins) / 60;

                  return hrs + ' hrs ' + mins + ' mins';
              }

              var width = 420;

              var colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

              var activities = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]

              var legend_colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700']
              var legend_second_colors = ['#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8']
          
              var legend_text = ["Home","Work","Work-Rel.","Edu.","Pick/Drop","Errand","Eating","Shop"]
              var legend_second_text = ["Social","Recreat.","Entertain.","Exercise","Accomp.","Oth. Home","Medical","Transfer"]
              // var legend_colors = ['#E5DF96','#E5A698','#CC98E5','#F95D00','#E52700','#B34CE5','#CEE598','#969696']
              // var legend_second_colors = ['#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

              // var legend_text = ["Home","Work","Education","Meal","Shopping","Entertain.","Exercise","Transfer"]
              // var legend_second_text = ["Car/Van","Taxi","Bus","Other","Scooter","LRT/MRT","Bicycle","Foot"]

              var colorScale = d3.scale.ordinal().range(colors)
                .domain(activities);

                      
              var chart = d3.timeline()
                .colors(colorScale)
                .colorProperty('activity');

              var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {

                  return "<span style='color:white'>" + d.activity + "<br>" + msToTime(d.ending_time-d.starting_time)+"</span>";
                });

              chart.stack();
              chart.showTimeAxisTick();
              chart.itemHeight(30);
              chart.margin({left: 10, right: 120, top: 0, bottom: 20});
              chart.itemMargin(7);
              chart.labelMargin(340);
              chart.mouseover(function(d,i,datum){
                return tip.show(d)
              });
              chart.mouseout(function(d){      
                return tip.hide(d)
              });


              var svg = d3.select("#activityTimeline")
                .append("svg")
                .attr("width", width)
                .datum(testDataWithColorPerTime).call(chart);

              d3.select('svg').remove();

              svg.call(tip);

              if (scope.legend){
                  //Legend
                  var svg2 = d3.select('#activityLegend').append("svg")
                    .attr("width", width).attr("height", 50);
                  var counter = 30;
                  for (i = 0; i < legend_text.length; i++) {


                    var text = svg2.append('text')
                          .attr('fill', 'black')
                          .attr('x', counter)
                          .attr('y', 20)
                          .text(legend_text[i])

                    var rects = svg2.append('rect')
                          .attr('fill',legend_colors[i])
                          .attr('width', 40)
                          .attr('height', 20)
                          .attr('x', counter)
                          .attr('y', 30);

                    counter +=50;
                  };

                  //Legend second row
                  var svg3 = d3.select('#activityLegend2').append("svg")
                    .attr("width", width).attr("height", 50);
                  var counter = 30;
                  for (i = 0; i < legend_second_text.length; i++) {


                    var text = svg3.append('text')
                          .attr('fill', 'black')
                          .attr('x', counter)
                          .attr('y', 10)
                          .text(legend_second_text[i])

                    var rects = svg3.append('rect')
                          .attr('fill',legend_second_colors[i])
                          .attr('width', 40)
                          .attr('height', 20)
                          .attr('x', counter)
                          .attr('y', 20);

                    counter +=50;
                  };
              }

          }); //should be scope.watch
        } 

      };

   })

