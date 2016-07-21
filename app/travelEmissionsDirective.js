   //camel cased directive name
   //in your HTML, this will be named as bars-chart
angular.module('myApp')

.directive('simpleChart', function () {
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
                  bigTitle:'@',
                  world: '=',
                  neighbors: '=',
                  legendDiv: '@',
                  legend:'=',
                  units: '@'},
         link: function (scope, element, attrs) {

            var margins = {
            top: 60,
            left: 10,
            right: 60,
            bottom: 50
            },

            width = 150,
            height = 265;

            var activityToColor = {},
            i,
            color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5', '#66ccff'],
            activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot", "Passengers"] //passengers is just for the color of the passengers graph
            for (i = 0; i < activity.length; i++) {
                activityToColor[activity[i]] = color[i];
            };

            var activityToAbbrev = {},
            i,
            activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
            abbrev = ["Home", "Work", "Business","Edu.","Pick Up","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accomp.","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]

            for (i = 0; i < activity.length; i++) {
                activityToAbbrev[activity[i]] = abbrev[i];
            };


            // var legend_text = ["Car/Van","Taxi","Bus","Other (mode)"]
            // var legend_second_text = ["Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
    
        //have to do this to sync data     
        scope.$watch('data', function(){
            var reflineNeighbor = scope.neighbors;
            var reflineWorld = scope.world;
            var dataset = scope.data;

            var series = dataset.map(function (d) {
              return d.name;
            }),

            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    // Structure it so that your numeric
                    // axis (the stacked amount) is y
                    return {
                        y: +o.count,
                        x: o.day,
                        mode: d.name
                    };
                });
            }),
            stack = d3.layout.stack();
            stack(dataset);

            dataset = dataset.map(function (group) {
            return group.map(function (d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0,
                    mode: d.mode
                };
              });
            });
        //SVG
            var svg = d3.select("#"+attrs.id)
                // .append("div").attr("class", "chart")
                .append('svg')
                .attr('width', width + margins.right)
                .attr('height', height + margins.top + margins.bottom)
                .append('g')
                .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

            var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<span style='color:white'>" + d.mode + "<br>"+ d.x + " " + scope.units + "</span>";
              })
                
            svg.call(tip);


            xMax = d3.max(dataset, function (group) {
                return d3.max(group, function (d) {
                    return d.x + d.x0;
                });
            }),
            
            xScale = d3.scale.linear()
                .domain([0, xMax])
                .range([0, width]),
            days = dataset[0].map(function (d) {
                return d.y;
            }),
          
            yScale = d3.scale.ordinal()
                .domain(days)
                .rangeRoundBands([0, height], .1),
                
            //X and Y axis ticks etc.
            xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(3)
                //.tickValues([0, 10, 20, 30])
                .outerTickSize(0)
                .tickFormat(d3.format(",.0f"))
                .orient('bottom'),
                
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .tickSize(0);

      if (reflineNeighbor != 0 && reflineWorld != 0){
      //Reference Line Neighbors
        svg.append("line")
          .style("stroke-dasharray", ("2,2"))
          .style("stroke", "black")
          .attr('class', 'ref ' + "Neighbors")
          .attr("x1", xScale(reflineNeighbor))
          .attr("y1", -4)
          .attr("x2", xScale(reflineNeighbor))
          .attr("y2", 265); 

        svg.append("circle")  
          .style("fill", "gray")
          .attr('class', 'ref ' + 'Neighbors')
          .attr("cx", xScale(reflineNeighbor)) 
          .attr("cy", -8)
          .attr("r", 8);

        svg.append("text")  
          .attr('class', 'refText ' + 'Neighbors')
          .attr("font-family", "sans-serif")
          .attr("font-size", "9px")
          .attr("fill", "white")
          .attr('x', xScale(reflineNeighbor)-3)
          .attr('y', -5)
          .text(reflineNeighbor);

        svg.append("text")
          .attr('class', 'refLabel ' + 'Neighbors')
          .attr('font', 'Open Sans')
          .attr("font-family", "sans-serif")
          .attr("font-size", "8px")
          .attr("fill", "black")
          .attr('x', xScale(reflineNeighbor)-15)
          .attr('y', -20)
          .text('Neighbors');

    //Reference Line World
        svg.append("line")
          .style("stroke-dasharray", ("2,2"))
          .style("stroke", "black")
          .attr('class', 'ref ' + "World")
          .attr("x1", xScale(reflineWorld))
          .attr("y1", -4)
          .attr("x2", xScale(reflineWorld))
          .attr("y2", 265); 

        svg.append("circle")  
          .style("fill", "gray")
          .attr('class', 'ref ' + 'World')
          .attr("cx", xScale(reflineWorld)) 
          .attr("cy", -8)
          .attr("r", 8);

        svg.append("text")  
          .attr('class', 'refText ' + 'World')
          .attr("font-family", "sans-serif")
          .attr("font-size", "9px")
          .attr("fill", "white")
          .attr('x', xScale(reflineWorld)-3)
          .attr('y', -5)
          .text(reflineWorld);

        svg.append("text")
          .attr('class', 'refLabel ' + 'World')
          .attr('font', 'Open Sans')
          .attr("font-family", "sans-serif")
          .attr("font-size", "8px")
          .attr("fill", "black")
          .attr('x', xScale(reflineWorld)-15)
          .attr('y', -27)
          .text('World');

        };

        //Bars
        var groups = svg.selectAll('g')
            .data(dataset)
            .enter()
            .append('g')

        groups.attr('class', 'group')
            .style('fill', function (d, i) {
              return activityToColor[series[i]];
            });

        var rects = groups.selectAll('rect')
            .data(function (d) {
              return d;
            })
            .enter()
            .append('rect')


        rects.attr('class', 'bar')
            .attr('x', function (d) {
              return xScale(d.x0);
            })
            .attr('y', function (d, i) {
              return yScale(d.y);
            })
            .attr('height', function (d) {
              return yScale.rangeBand();
            })
            .attr('width', function (d) {
              return xScale(d.x);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


        //X and Y axes
        svg.append('g')
            .attr('class', 'emissions x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
                
        svg.append('g')
            .attr('class', 'emissions y axis')
            .attr('transform', 'translate(-10, 0)')
            .call(yAxis);
          
        //X axis label
        svg.append('text')
            .attr('class', 'label')
            .attr('fill','black')
            .attr('x', 0)
            .attr('y', height+45)
            .text(scope.title);

            //top label
        svg.append('text')
            .attr('class', 'bigTitle')
            .attr('fill','black')
            .attr('x', 0)
            .attr('y', -40)
            .text(scope.bigTitle);


        if (scope.legend){

            if ('#'+attrs.id == '#totalEmissions'){
                var svg4 = d3.select('#'+attrs.id).append("svg")
                  .attr("class", scope.legendDiv +"").attr("width", 350).attr("height", 50);

                var text = svg4.append('text')
                      .attr('fill', 'black')
                      .attr('x', 120)
                      .attr('y', 10)
                      .text('Home')

                var rects = svg4.append('rect')
                      .attr('fill',activityToColor['Home'])
                      .attr('width', 25)
                      .attr('height', 25)
                      .attr('x', 120)
                      .attr('y', 20);

              }

            else{
            //Legend
            var svg2 = d3.select('#'+attrs.id).append("svg")
              .attr("class", scope.legendDiv +"").attr("width", 350).attr("height", 50);
            var counter = 0;
            for (var i = 0; i < Math.floor(series.length / 2); i++) {

              var text = svg2.append('text')
                    .attr('fill', 'black')
                    .attr('x', counter)
                    .attr('y', 10)
                    .text(activityToAbbrev[series[i]])

              var rects = svg2.append('rect')
                    .attr('fill',activityToColor[series[i]])
                    .attr('width', 25)
                    .attr('height', 25)
                    .attr('x', counter)
                    .attr('y', 20);

              counter +=42;
            }

            //Legend second row
            var svg3 = d3.select('#'+attrs.id).append("svg")
              .attr("class", scope.legendDiv +"2").attr("width", 370).attr("height", 50);
            var counter = 0;
            for (var i = Math.floor(series.length/2); i < series.length-1; i++) {


              var text = svg3.append('text')
                    .attr('fill', 'black')
                    .attr('x', counter)
                    .attr('y', 10)
                    .text(activityToAbbrev[series[i]])

              var rects = svg3.append('rect')
                    .attr('fill', activityToColor[series[i]])
                    .attr('width', 25)
                    .attr('height', 25)
                    .attr('x', counter)
                    .attr('y', 20);

              counter +=42;
            };
          }


        }; 

      });//scope.watch


        } 

      };

   })


//Uses js/d3-timeline.js 
.directive('activityTimeline', function () { 
     return {
         restrict: 'E',
         scope: { data: '=chartData',
                  title: '@chartTitle',
                  bigTitle: '@',
                  legend:'@',
                  width:'=',
                  tickInterval: '=',
                  labelMargin: '='
                  },
         link: function (scope, element, attrs) {
            scope.$watch('data', function(){
              if (scope.data != null){
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

                  var width = scope.width;

                  var colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

                  var activities = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]

                  var small_legend_colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700']
                  var small_legend_second_colors = ['#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8']
              
                  var small_legend_text = ["Home","Work","Work-Rel.","Edu.","Pick/Drop","Errand","Eating","Shop"]
                  var small_legend_second_text = ["Social","Recreat.","Entertain.","Exercise","Accomp.","Oth. Home","Medical","Transfer"]

                  var big_legend_colors = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598']
                  var big_legend_second_colors = ['#E5664C','#906860','#703090','#C8C8C8','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

                  var big_legend_text = ["Home","Work","Work-Rel.","Edu.","Pick/Drop","Errand","Eating","Shop","Social","Recreat.","Entertain.","Exercise"]
                  var big_legend_second_text = ["Accomp.","Oth. Home","Medical","Transfer","Car/Van","Taxi","Bus","Other","Scooter","LRT/MRT","Bicycle","Foot"]

                  // var legend_colors = ['#E5DF96','#E5A698','#CC98E5','#F95D00','#E52700','#B34CE5','#CEE598','#969696']
                  // var legend_second_colors = ['#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']

                  var activityToColor = {},
                  i,
                  color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5', '#66ccff'],
                  activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot", "Passengers"] //passengers is just for the color of the passengers graph
                  for (i = 0; i < activity.length; i++) {
                      activityToColor[activity[i]] = color[i];
                  };

                  var activityToAbbrev = {},
                  i,
                  activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
                  abbrev = ["Home", "Work", "Business","Edu.","Pick Up","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accomp.","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]

                  for (i = 0; i < activity.length; i++) {
                      activityToAbbrev[activity[i]] = abbrev[i];
                  };

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
                  chart.itemHeight(33); //height of bars
                  chart.margin({left: 20, right: 110, top: 20, bottom: 20});
                  chart.itemMargin(5); //margin between horizontal bars
                  chart.labelMargin(scope.labelMargin); //controls where Monday, Tuesday, etc labels go
                  chart.tickFormat({format: d3.time.format("%I %p"),
                                    tickTime: d3.time.hours,
                                    tickInterval: scope.tickInterval, //change tick intervalshere!!
                                    tickSize: 6,
                                    tickValues: null
                                  })
                  chart.mouseover(function(d,i,datum){
                    return tip.show(d)
                  });
                  chart.mouseout(function(d){      
                    return tip.hide(d)
                  });

                  var svg = d3.select("#"+attrs.id)
                    .append("svg")
                    .attr("width", width)
                    .datum(testDataWithColorPerTime).call(chart);


                  svg.call(tip);

                  //big label
                  svg.append('text')
                    .attr('class', 'bigTitle')
                    .attr('fill','black')
                    .attr('x', 0)
                    .attr('y', 15)
                    .text(scope.bigTitle);

                  var legend_text = '';
                  var legend_colors = '';
                  var legend_second_text = '';
                  var legend_second_colors = '';


                  if (scope.legend == 'small'){
                    legend_text = small_legend_text;
                    legend_colors = small_legend_colors;
                    legend_second_text = small_legend_second_text;
                    legend_second_colors = small_legend_second_colors;

                  }

                  if (scope.legend == 'big'){
                    legend_text = big_legend_text;
                    legend_colors = big_legend_colors;
                    legend_second_text = big_legend_second_text;
                    legend_second_colors = big_legend_second_colors;
                  }
                      

                      //Legend
                      var svg2 = d3.select("#"+attrs.id).append("svg")
                        .attr("width", width+100).attr("height", 50).attr("class", "activityLegend").attr("id", "#"+attrs.id + "Legend1");
                      var counter = 0;
                      for (i = 0; i < legend_text.length; i++) {


                        var text = svg2.append('text')
                              .attr('fill', 'black')
                              .attr('x', counter)
                              .attr('y', 10)
                              .text(legend_text[i])

                        var rects = svg2.append('rect')
                              .attr('fill',legend_colors[i])
                              .attr('width', 40)
                              .attr('height', 20)
                              .attr('x', counter)
                              .attr('y', 20);

                        counter +=50;
                      };

                      //Legend second row
                      var svg3 = d3.select("#"+attrs.id).append("svg")
                        .attr("width", 600).attr("height", 50).attr("class", "activityLegend2").attr("id", "#"+attrs.id + "Legend2");
                      var counter = 0;
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

              }; //if scope.data != null
          }); //should be scope.watch
        } 

      };

   })


.directive('weeklyCarbonChart', function () {
     return {
         restrict: 'E',
         scope: { data: '=chartData',
                  title: '@chartTitle',
                  bigTitle: '@',
                  legend:'='},
         link: function (scope, element, attrs) {
            var margin = {
                top: 70,
                right: 20,
                bottom: 60,
                left: 60
              },
              width = 200 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .rangeRound([height, 0]);

            var color = d3.scale.ordinal()
                .range(["#008000", "#804000"]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(0)
                .tickPadding(10)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".2s"));

            var svg = d3.select("#weeklyCarbonCost").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.csv("data/weeklyCarbonCost.csv", function(error, data) {
              if (error) throw error;

              color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

              data.forEach(function(d) {
                var y0 = 0;
                d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                d.total = d.ages[d.ages.length - 1].y1;
              });

             // data.sort(function(a, b) { return b.total - a.total; });

              x.domain(data.map(function(d) {return d.State; }));
              y.domain([0, d3.max(data, function(d) {return d.total; })]);

              var tip1 = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                      .html(function(d) {
                        if (d.name=='userShare'){
                        return "<span style='color:white'>" + "$" + (d.y1-d.y0) + " - Your Share of Carbon Cost" + "</span>";
                      }
                      else{
                        return "<span style='color:white'>" + "$" + (d.y1-d.y0) + " - Full Cost of Car and Fuel" + "</span>";
                        }
                      })
              var tip2 = d3.tip()

              svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .attr("class", "weekly x axis")
                  // .attr("class", "weekly x text")
                  .call(xAxis);

              svg.append("g")
                  .attr("class", "weekly y axis")
                  .call(yAxis)
                .append("text")
                  .attr("class", "weekly y text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Cost (SGD)");

              var state = svg.selectAll(".state")
                  .data(data)
                .enter().append("g")
                  .attr("class", "g")
                  .attr("transform", function(d) {
                   
                    t = x(d.State)
                    t+=15
                    return "translate(" + t + ",0)"; 
                  })

                state.call(tip1)


              state.selectAll("rect")
                  .data(function(d) { return d.ages; })
                .enter().append("rect")
                  .attr("width", x.rangeBand()-25)
                  .attr("y", function(d) { return y(d.y1); })
                  .attr("height", function(d) {return y(d.y0) - y(d.y1); })
                  .on('mouseover', tip1.show)
                  .on('mouseout', tip1.hide)
                  .style("fill", function(d) { return color(d.name); });


                //Daily carbon emissions top label
              svg.append('text')
                  .attr('class', 'bigTitle')
                  .attr('fill','black')
                  .attr('x', 50)
                  .attr('y', -53)
                  .text(scope.bigTitle);

            });
        } 

      };

   })



   .directive('weeklyChart', function () {
     return {
         restrict: 'E',
         scope: {title: '@chartTitle',
                  bigTitle: '@',
                  url:'@',
                  legend:'=',
                  color:'@',
                  units:'@'},
         link: function (scope, element, attrs) {
            scope.$watch('data', function(){
              var margin = {
                  top: 120,
                  right: 20,
                  bottom: 200,
                  left: 40
                },
                width = 250,
                height = 360;

              var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

              var y = d3.scale.linear()
                .range([height, 0]);

              var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(0)
                .tickPadding(10)
                .orient("bottom");

              var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

              var svg = d3.select("#"+attrs.id).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "svg")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


              d3.csv(scope.url, type, function(error, data) {

                // console.log(data)
                x.domain(data.map(function(d) {
                  return d.mode;
                }));

                y.domain([0, d3.max(data, function(d) {
                  return Math.max(d.user, d.neighbor);
                })]);

                svg.append("g")
                  .attr("class", "weekly x axis")
                  .attr("class", "weekly x text")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

                svg.append("g")
                  .attr("class", "weekly y axis")
                  .attr("transform", "translate(-10,0)")
                  .call(yAxis)

                  // .append("text")
                  // .attr("class", "weekly y text")
                  // .attr("transform", "rotate(-90)")
                  // .attr("y", 6)
                  // .attr("dy", ".71em")
                  // .style("text-anchor", "end")
                  // .text('Distance (km)');

            // create a group for your overlapped bars
                var g = svg.selectAll(".bars")
                  .data(data)
                  .enter().append("g")

                var tip1 = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])

                var tip2 = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])

            // place the second bar on top of it
                var bar1 = g.append("rect")
                 // .attr("class", "bar2")
                  .attr('fill', scope.color)
                  .attr('opacity', 0.3)
                  .attr("x", function(d) {
                    return x(d.mode) + 20;
                  })
                  .attr("width", x.rangeBand() - 20)
                  .attr("y", function(d) {
                    tip1.html(function(d) {
                      return "<span style='color:white'>" + "Neighbors: " + "<br>" + d.mode+ " " + d.neighbor + " "+scope.units + "</span>";
                    })
                    return y(d.neighbor);
                  })
                  .attr("height", function(d) {
                    return height - y(d.neighbor);
                  })
                  bar1.call(tip1)
                  .on('mouseover', tip1.show)
                  .on('mouseout', tip1.hide);        
                 
            // place the first bar  
                var bar2 = g.append("rect")
                  .attr('fill', scope.color)
                  .attr("class", "bar1")
                  .attr("x", function(d) {
                    return x(d.mode) + 5; // center it
                  })
                  .attr("width", x.rangeBand() - 20) // make it slimmer
                  .attr("y", function(d) {
                    tip2.html(function(d) {
                      return "<span style='color:white'>" + "You: " + "<br>" + d.mode+ " " + d.user + " "+scope.units + "</span>";
                    })

                    return y(d.user);
                  })
                  .attr("height", function(d) {
                    return height - y(d.user);
                  })
                  bar2.call(tip2)
                  .on('mouseover', tip2.show)
                  .on('mouseout', tip2.hide);
                

            if (scope.legend){
               //Legend labels
                svg.append('text')
                  .attr("class", "weekly text")
                  .attr('fill', 'black')
                  .attr('x', 40)
                  .attr('y', 437)
                  .text("You");

                svg.append('text')
                  .attr("class", "weekly text")
                  .attr('fill', 'black')
                  .attr('x', 112)
                  .attr('y', 437)
                  .text("Your neighbors");

                //Legend 
                svg.append('rect')
                  .attr('fill', scope.color)
                  .attr('width', 25)
                  .attr('height', 25)
                  .attr('x', 10)
                  .attr('y', 420);

                svg.append('rect')
                  .attr('fill', scope.color)
                  .attr('opacity', 0.3)
                  .attr('width', 25)
                  .attr('height', 25)
                  .attr('x', 80)
                  .attr('y', 420);

                //Car icon
                svg.append("image")
                  .attr("xlink:href", "images/car.png")
                  .attr("x", 13)
                  .attr("y", 340)
                  .attr("width", 19)
                  .attr("height", 19);    

                //Bus icon
                svg.append("image")
                  .attr("xlink:href", "images/bus.png")
                  .attr("x", 63)
                  .attr("y", 340)
                  .attr("width", 15)
                  .attr("height", 15);

                //Train icon
                svg.append("image")
                  .attr("xlink:href", "images/train.png")
                  .attr("x", 110)
                  .attr("y", 340)
                  .attr("width", 20)
                  .attr("height", 20); 

                //Bike icon
                svg.append("image")
                  .attr("xlink:href", "images/bike.png")
                  .attr("x", 158)
                  .attr("y", 340)
                  .attr("width", 22)
                  .attr("height", 22);   

                //Walk icon
                svg.append("image")
                  .attr("xlink:href", "images/walk.png")
                  .attr("x", 207)
                  .attr("y", 340)
                  .attr("width", 21)
                  .attr("height", 21); 

                //Big label
                svg.append('text')
                    .attr('class', 'bigTitle')
                    .attr('fill','black')
                    .attr('x', 30)
                    .attr('y', -60)
                    .text(scope.bigTitle);
                  }
              });
            }); //scope.watch

                function type(d) {
                  d.user = +d.user;
                  d.neighbor = +d.neighbor;
                  return d;
                }
        } 

      };

   })






.directive('transition', function () {
 return {
     restrict: 'E',
     scope: { data: '=chartData',
              title: '@chartTitle',
              bigTitle:'@',
              world: '=',
              neighbors: '=',
              legendDiv: '@',
              legend:'=',
              units: '@',
              control: '='},
     link: function (scope, element, attrs) {
        scope.$watch('data', function(){
          if (scope.data != null){

                scope.internalControl = scope.control || {};

                var units = scope.units
                var refValue = 30;

                var margins = {
                top: 85,
                left: 80,
                right: 20,
                bottom: 120
                },

                legendPanel = {
                  width: 180
                },

                width = 500 - margins.left - margins.right - legendPanel.width,
                height = 265;

                //modes = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]

                // //Color Scheme
                // colors = d3.scale.quantize()
                //   .domain([0,1,2,3,4,5,6,7])
                //   .range(['#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5']);

                var activityToColor = {},
                        i,
                        color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5'],
                        activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
                    for (i = 0; i < activity.length; i++) {
                        activityToColor[activity[i]] = color[i];
                };

                var activityToAbbrev = {},
                    i,
                    activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
                    abbrev = ["Home", "Work", "Business","Edu.","Pick Up","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accompany","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]

                for (i = 0; i < activity.length; i++) {
                    activityToAbbrev[activity[i]] = abbrev[i];
                };


                var legend_text = ["Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]

                d3.json("data/dailyDistance.json", function(error, dataset) {  
                      series = dataset.map(function (d) {
                          return d.name;
                      }),

                      dataset = dataset.map(function (d) {
                          return d.data.map(function (o, i) {
                              // Structure it so that your numeric
                              // axis (the stacked amount) is y
                              return {
                                  y: +o.count,
                                  x: o.day
                              };
                          });
                      }),

                      stack = d3.layout.stack();
                      stack(dataset);

                      dataset = dataset.map(function (group) {
                      return group.map(function (d) {
                          // Invert the x and y values, and y0 becomes x0
                          return {
                              x: d.y,
                              y: d.x,
                              x0: d.y0
                          };
                        });
                      });

                  //SVG
                      var svg = d3.select('#'+attrs.id)
                          .append('svg')
                          .attr('width', width + margins.left + margins.right + legendPanel.width)
                          .attr('height', height + margins.top + margins.bottom)
                          .append('g')
                          .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

            ////////////////////////////////////////////////////////////////////////
                      var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                          return "<span style='color:white'>" + d.x + " " + units + "</span>";
                        })
                          
                      svg.call(tip);


                      xMax = d3.max(dataset, function (group) {
                          return d3.max(group, function (d) {
                              return d.x + d.x0;
                          });
                      }),
                      
                      xScale = d3.scale.linear()
                          .domain([0, xMax])
                          .range([0, width]),
                      days = dataset[0].map(function (d) {
                          return d.y;
                      }),
                    
                      yScale = d3.scale.ordinal()
                          .domain(days)
                          .rangeRoundBands([0, height], .1),
                          
                      //X and Y axis ticks etc.
                      xAxis = d3.svg.axis()
                          .scale(xScale)
                          .ticks(4)
                          //.tickValues([0, 10, 20, 30])
                          .outerTickSize(0)
                          .tickFormat(d3.format(",.0f"))
                          .orient('bottom'),
                          
                      yAxis = d3.svg.axis()
                          .scale(yScale)
                          .orient('left')
                          .tickSize(0);
                          

            ///ref line code here
                  drawRefLine(svg, refValue, "Neighbors", 0);
                  drawRefLine(svg, 20, "World" , 7);

                  //Bars
                  var groups = svg.selectAll('g')
                      .data(dataset)
                      .enter()
                      .append('g')
                        

                  groups.attr('class', 'group')
                      .style('fill', function (d, i) {
                        return activityToColor[series[i]];
                      });

                  var rects = groups.selectAll('rect')
                      .data(function (d) {
                        return d;
                      })
                      .enter()
                      .append('rect')

                  rects.attr('class', 'bar')
                      .attr('x', function (d) {
                        return xScale(d.x0);
                      })
                      .attr('y', function (d, i) {
                        return yScale(d.y);
                      })
                      .attr('height', function (d) {
                        return yScale.rangeBand();
                      })
                      .attr('width', function (d) {
                        return xScale(d.x);
                      })
                      .on('mouseover', tip.show)
                      .on('mouseout', tip.hide);


                  //X and Y axes
                  svg.append('g')
                      .attr('class', 'transition x axis')
                      .attr('transform', 'translate(0,' + height + ')')
                      .call(xAxis);
                          
                  svg.append('g')
                      .attr('class', 'transition y axis')
                      .attr('transform', 'translate(-10, 0)')
                      .call(yAxis);
                    
                  //X axis label
                  svg.append('text')
                      .attr('class', 'label')
                      .attr('fill','black')
                      .attr('x', 0)
                      .attr('y', height+45)
                      .text('Distance Traveled (km)');

                  //Big label
                  svg.append('text')
                      .attr('class', 'bigTitle')
                      .attr('fill','black')
                      .attr('x', 30)
                      .attr('y', -60)
                      .text(scope.bigTitle);

                for (i = 0; i < legend_text.length; i++) {

                      svg.append('text')
                          .attr('class', 'legendLabel')
                          .attr('fill', 'black')
                          .attr('x', i * 48)
                          .attr('y', 340)
                          .text(activityToAbbrev[legend_text[i]]);
                      svg.append('rect')
                          .attr('fill', activityToColor[legend_text[i]])
                          .attr('width', 25)
                          .attr('height', 25)
                          .attr('x', i * 48)
                          .attr('y', 345);
                          
                      
              };
                  // //Legend
                  // series.forEach(function (s, i) {
                          
                  //     //Car icon
                  //     svg.append("image")
                  //       .attr("xlink:href", "images/car.png")
                  //       .attr("x", 2.7)
                  //       .attr("y", -65)
                  //       .attr("width", 19)
                  //       .attr("height", 19);    

                  //     //Bus icon
                  //     svg.append("image")
                  //       .attr("xlink:href", "images/bus.png")
                  //       .attr("x", 40)
                  //       .attr("y", -54.7)
                  //       .attr("width", 15)
                  //       .attr("height", 15);

                  //     //Train icon
                  //     svg.append("image")
                  //       .attr("xlink:href", "images/train.png")
                  //       .attr("x",72.3)
                  //       .attr("y", -55)
                  //       .attr("width", 20)
                  //       .attr("height", 20); 

                  //     //Walk icon
                  //     svg.append("image")
                  //       .attr("xlink:href", "images/walk.png")
                  //       .attr("x", 107.5)
                  //       .attr("y", -57)
                  //       .attr("width", 20)
                  //       .attr("height", 20);   



                          
                  // });
              });



            //****************************************************************************
            // ** Update data section (Called from the onclick)
            //label is for x axis label
            //datafilename is for the data file - ex. distance.json
            //numTicks is # of tickmarks in x axis
            //unit is unit of measurement
            //refValue is the value of the reference line - a number
            //refText is the String label for the reference line - ex. "Neighbors"
            scope.internalControl.updateTransitionData = function updateTransitionData(label, datafilename, numTicks, unit, refValueNeighbors, refValueWorld) {
              
              units = unit;

              var margins = {
              top: 85,
              left: 80,
              right: 20,
              bottom: 50
              },

              legendPanel = {
                width: 180
              },

              width = 500 - margins.left - margins.right - legendPanel.width,
              height = 400 - margins.top - margins.bottom;

              units = unit;
                // Get the data again
              d3.json(datafilename, function(error, dataset) { 
                series = dataset.map(function (d) {
                          return d.name;
                      }),

                dataset = dataset.map(function (d) {
                    return d.data.map(function (o, i) {
                        // Structure it so that your numeric
                        // axis (the stacked amount) is y
                        return {
                            y: +o.count,
                            x: o.day
                        };
                    });
                }),

                stack = d3.layout.stack();
                stack(dataset);

                dataset = dataset.map(function (group) {
                  return group.map(function (d) {
                    // Invert the x and y values, and y0 becomes x0
                    return {
                        x: d.y,
                        y: d.x,
                        x0: d.y0
                    };
                  });
                });

                xMax = d3.max(dataset, function (group) {
                          return d3.max(group, function (d) {
                              return d.x + d.x0;
                          });
                      }),
                      
                xScale = d3.scale.linear()
                    .domain([0, xMax])
                    .range([0, width]),
                days = dataset[0].map(function (d) {
                    return d.y;
                }),
              
                yScale = d3.scale.ordinal()
                    .domain(days)
                    .rangeRoundBands([0, height], .1),
                    
                //X and Y axis ticks etc.
                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .ticks(numTicks)
                    //.tickValues([0, 10, 20, 30])
                    .outerTickSize(0)
                    .tickFormat(d3.format(",.0f"))
                    .orient('bottom');

                // Select the section we want to apply our changes to
                var svg = d3.select("#" + attrs.id).transition();

                // Make the changes

                  svg.select(".transition.x.axis") // change the x axis
                      .transition()
                      .duration(600)
                      .call(xAxis);

                  svg.select('.label')
                      .transition()
                      .duration(600)
                      .text(label);

                      console.log(refValueWorld);

                //change reflines Neighbors
                  svg.selectAll('.ref').filter('.' + "Neighbors")
                    .transition()
                    .duration(300)
                    .attr("x1", xScale(refValueNeighbors))
                    .attr("x2", xScale(refValueNeighbors))
                    .attr("cx", xScale(refValueNeighbors));


                  var offset = 0;

                  if (refValueNeighbors <10){
                    offset = 2.5;
                  };

                  svg.selectAll('.refText').filter('.' + "Neighbors")
                    .duration(600)
                    .attr('x', xScale(refValueNeighbors)-5+offset)
                    .text(refValueNeighbors);

                  svg.selectAll('.refLabel').filter('.' + "Neighbors")
                    .duration(600)
                    .attr('x', xScale(refValueNeighbors)-15)
                    .text("Neighbors");

              //change reflines World
                  svg.selectAll('.ref').filter('.' + "World")
                    .transition()
                    .duration(300)
                    .attr("x1", xScale(refValueWorld))
                    .attr("x2", xScale(refValueWorld))
                    .attr("cx", xScale(refValueWorld));


                  var offset = 0;

                  if (refValueWorld <10){
                    offset = 3;
                  };

                  svg.selectAll('.refText').filter('.' + "World")
                    .duration(600)
                    .attr('x', xScale(refValueWorld)-5+offset)
                    .text(refValueWorld);

                  svg.selectAll('.refLabel').filter('.' + "World")
                    .duration(600)
                    .attr('x', xScale(refValueWorld)-15)
                    .text("World");



                var svg1 = d3.select('#'+attrs.id);
                // drawRefLine(svg1, 40, "World");

                var groups = svg1.selectAll('.group')
                    .data(dataset)

                var rects = groups.selectAll('.bar')
                    .data(function (d) {
                      return d;
                    })
                    .transition()
                    .duration(700)
                    .attr('x', function (d) {
                      return xScale(d.x0);
                    })
                    .attr('y', function (d, i) {
                      return yScale(d.y);
                    })
                    .attr('height', function (d) {
                      return yScale.rangeBand();
                    })
                    .attr('width', function (d) {
                      return xScale(d.x);
                    });

                });
            };

            drawRefLine = function drawRefLine(svg, refValue, refText, yOffset){

                    //Reference Line
                  svg.append("line")
                    .style("stroke-dasharray", ("2,2"))
                    .style("stroke", "black")
                    .attr('class', 'ref ' + refText)
                    .attr("x1", xScale(refValue))
                    .attr("y1", -4)
                    .attr("x2", xScale(refValue))
                    .attr("y2", 265); 

                  svg.append("circle")  
                    .style("fill", "gray")
                    .attr('class', 'ref ' + refText)
                    .attr("cx", xScale(refValue)) 
                    .attr("cy", -8)
                    .attr("r", 8);

                  svg.append("text")  
                    .attr('class', 'refText ' + refText)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "9px")
                    .attr("fill", "white")
                    .attr('x', xScale(refValue)-5)
                    .attr('y', -5)
                    .text(refValue);

                  svg.append("text")
                    .attr('class', 'refLabel ' + refText)
                    .attr('font', 'Open Sans')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "8px")
                    .attr("fill", "black")
                    .attr('x', xScale(refValue)-15)
                    .attr('y', -20-yOffset)
                    .text(refText);
            }
          }; //if scope.data != null
      }); //should be scope.watch
    } 

  };

})





.directive('weeklyTransition', function () {
 return {
     restrict: 'E',
     scope: { title: '@chartTitle',
              bigTitle:'@',
              legend:'=',
              units: '@',
              color: '@',
              control: '='},
     link: function (scope, element, attrs) {


        scope.$watch('data', function(){
          // if (scope.data != null){
            var units = scope.units;

                scope.internalControl = scope.control || {};
                var margin = {
                    top: 60,
                    right: 20,
                    bottom: 60,
                    left: 40
                  },
                  width = 350 - margin.left - margin.right,
                  height = 420;

                var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                  .range([height, 0]);

                var xAxis = d3.svg.axis()
                  .scale(x)
                  .tickSize(0)
                  .tickPadding(10)
                  .orient("bottom");

                var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

                var svg = d3.select("#" + attrs.id).append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .attr("class", "svg")
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





                d3.csv("data/weeklyTravelDistance.csv", type, function(error, data) {
                  // console.log(data)
                  x.domain(data.map(function(d) {
                    return d.mode;
                  }));
                  y.domain([0, d3.max(data, function(d) {
                    return Math.max(d.user, d.neighbor);
                  })]);

                  svg.append("g")
                    .attr("class", "weekly x axis")
                    .attr("class", "weekly x text")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                  svg.append("g")
                    .attr("class", "weekly y axis")
                    .attr("transform", "translate(-10,0)")
                    .call(yAxis)

                    .append("text")
                    .attr("class", "weekly y text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text('Distance (km)');

              // create a group for your overlapped bars
                  var g = svg.selectAll(".bars")
                    .data(data)
                    .enter().append("g")

                  var tip1 = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])

                  var tip2 = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    // .html(function(d) {
                    //   return "<span style='color:white'>" + d.user + " " + units + "</span>";
                    // })
                      
              // neighbors bar
                  var bar1 = g.append("rect")
                    .attr("class", "bar2")
                    .attr('fill', scope.color)
                    .attr('opacity', 0.3)
                    .attr("x", function(d) {
                      return x(d.mode) + 20;
                    })
                    .attr("width", x.rangeBand() - 20)
                    .attr("y", function(d) {
                      tip1.html(function(d) {
                        return "<span style='color:white'>" + d.neighbor + " " + units + "</span>";
                      })
                      return y(d.neighbor);
                    })
                    .attr("height", function(d) {
                      return height - y(d.neighbor);
                    })
                    bar1.call(tip1)
                    .on('mouseover', tip1.show)
                    .on('mouseout', tip1.hide);        
                   
              // users bar  
                  var bar2 = g.append("rect")
                    .attr("class", "bar1")
                    .attr('fill', scope.color)
                    .attr("x", function(d) {
                      return x(d.mode) + 5; // center it
                    })
                    .attr("width", x.rangeBand() - 20) // make it slimmer
                    .attr("y", function(d) {
                      tip2.html(function(d) {
                        return "<span style='color:white'>" + d.user + " " + units + "</span>";
                      })

                      return y(d.user);
                    })
                    .attr("height", function(d) {
                      return height - y(d.user);
                    })
                    bar2.call(tip2)
                    .on('mouseover', tip2.show)
                    .on('mouseout', tip2.hide);
                  

                  //Legend labels
                  svg.append('text')
                    .attr("class", "weekly text")
                    .attr('fill', 'black')
                    .attr('x', 40)
                    .attr('y', 468)
                    .text("You");

                  svg.append('text')
                    .attr("class", "weekly text")
                    .attr('fill', 'black')
                    .attr('x', 112)
                    .attr('y', 468)
                    .text("Your neighbors");

                  //Legend 
                  svg.append('rect')
                    .attr('fill', scope.color)
                    .attr('id', 'you')
                    .attr('width', 25)
                    .attr('height', 25)
                    .attr('x', 10)
                    .attr('y', 450);

                  svg.append('rect')
                    .attr('fill', scope.color)
                    .attr('id', 'neighbor')
                    .attr('opacity', 0.3)
                    .attr('width', 25)
                    .attr('height', 25)
                    .attr('x', 80)
                    .attr('y', 450);

                  //Car icon
                  svg.append("image")
                    .attr("xlink:href", "images/car.png")
                    .attr("x", 18.5)
                    .attr("y", 400)
                    .attr("width", 19)
                    .attr("height", 19);    

                  //Bus icon
                  svg.append("image")
                    .attr("xlink:href", "images/bus.png")
                    .attr("x", 76.5)
                    .attr("y", 400)
                    .attr("width", 15)
                    .attr("height", 15);

                  //Train icon
                  svg.append("image")
                    .attr("xlink:href", "images/train.png")
                    .attr("x", 130)
                    .attr("y", 396)
                    .attr("width", 20)
                    .attr("height", 20); 

                  //Bike icon
                  svg.append("image")
                    .attr("xlink:href", "images/bike.png")
                    .attr("x", 185)
                    .attr("y", 397)
                    .attr("width", 22)
                    .attr("height", 22);   

                  //Walk icon
                  svg.append("image")
                    .attr("xlink:href", "images/walk.png")
                    .attr("x", 241)
                    .attr("y", 396)
                    .attr("width", 21)
                    .attr("height", 21);

                  //top label
                  svg.append('text')
                      .attr('class', 'bigTitle')
                      .attr('id', 'weeklyBigTitle')
                      .attr('fill','black')
                      .attr('x', 0)
                      .attr('y', -40)
                      .text(scope.bigTitle);  

              });

              //****************************************************************************
              // ** Update data section (Called from the onclick)
              //label is for x axis label
              //datafilename is for the data file - ex. distance.json
              //numTicks is # of tickmarks in x axis
              //unit is unit of measurement
              //value is the value of the reference line - a number
              //text is the label for the reference line - ex. "Neighbors"
              scope.internalControl.updateWeeklyData = function updateWeeklyData(label, datafilename, unit, chartColor, title) {
                units = unit;

                var margin = {
                    top: 60,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                width = 350 - margin.left - margin.right,
                height = 420;


                d3.csv(datafilename, type, function(error, data) {

                  var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                  var y = d3.scale.linear()
                    .range([height, 0]);

                  var xAxis = d3.svg.axis()
                    .scale(x)
                    .tickSize(0)
                    .tickPadding(10)
                    .orient("bottom");

                  var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");
                    //console.log(data)
                  x.domain(data.map(function(d) {
                    return d.mode;
                  }));
                  y.domain([0, d3.max(data, function(d) {
                    return Math.max(d.user, d.neighbor);
                  })]);

                  // Select the section we want to apply our changes to
                  var svg = d3.select("#" +attrs.id).transition();


                  svg.select(".weekly.y.axis") // change the x axis
                      .transition()
                      .duration(600)
                      .call(yAxis)

                  svg.select(".weekly.y.text")
                      .style("text-anchor", "end")
                      .text(label);
                    
                  //Legend 
                  svg.select('#you')
                    .transition()
                    .attr('fill', chartColor);

                  svg.select('#neighbor')
                    .transition()
                    .attr('fill', chartColor);

                  //Title
                  svg.select("#weeklyBigTitle")
                    .text(title);

                  var svg1 = d3.select('#'+attrs.id);

                  var rects = svg1.selectAll('.bar2')
                    .data(data)
                    .transition()
                    .duration(700)
                    .attr('fill', chartColor)
                    .attr("x", function(d) {
                      return x(d.mode) + 20;
                    })
                    // .attr("width", x.rangeBand() - 20)
                    .attr("y", function(d) {
                      return y(d.neighbor);
                    })
                    .attr("height", function(d) {
                      return height - y(d.neighbor);
                    })
                    ;   

                  var rects2 = svg1.selectAll('.bar1')
                    .data(data)
                    .transition()
                    .duration(700)
                    .attr('fill', chartColor)
                    .attr("x", function(d) {
                      return x(d.mode) + 5; // center it
                    })
                    // .attr("width", x.rangeBand() - 20) // make it slimmer
                    .attr("y", function(d) {
                      return y(d.user);
                    })
                    .attr("height", function(d) {
                      return height - y(d.user);
                    });

                  });
              };



                  function type(d) {
                    d.user = +d.user;
                    d.neighbor = +d.neighbor;
                    return d;
                  }
          // }; //if scope.data != null
      }); //should be scope.watch
    } 

  };

})
