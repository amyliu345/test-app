var activityToColor = {},
    i,
    color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#FF0000','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5'],
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

var linesToAdd = []

var linesToRemove = []

var lines = []

var modeColors = []

var emissionsColors = []


var map;
var bounds;
var data;

function initialize() {
    var myLatlng = new google.maps.LatLng(1.36692, 103.94706);
    var myOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    }

    map = new google.maps.Map(document.getElementById("map"), myOptions);
    bounds = new google.maps.LatLngBounds();

    // var coords = [];

    // addDomListener(instance:Object, eventName:string, handler:Function)


    $.getJSON( "data/gps.json", function(data) {

        data = data;

        for (var i = 0; i < data.length; i++){

            var dayLines = []
            for (var j = 0; j < data[i].data.length; j++){
                dayLines.push(newPolyline(i,j,data));
            }
            lines.push(dayLines)
            toggle(i)
        }
        // setBounds(lines[0]);
    });


}

(function($) {
  $.fn.clickToggle = function(func1, func2) {
      var funcs = [func1, func2];
      this.data('toggleclicked', 0);
      this.click(function() {
          var data = $(this).data();
          var tc = data.toggleclicked;
          $.proxy(funcs[tc], this)();
          data.toggleclicked = (tc + 1) % 2;
      });
      return this;
  };
}(jQuery));

function toggle(dayIndex){
    $('#'+dayIndex).clickToggle(function() {   
        // console.log("handler1")
        updateMultiday(dayIndex,true);
    },
    function() {
        // console.log("handler2")
        updateMultiday(dayIndex,false);
    });
}

function newPolyline(dayIndex, dataIndex, data){
    var path = data[dayIndex].data[dataIndex].EncodedPoints
    var levels = data[dayIndex].data[dataIndex].Levels
    var mode = data[dayIndex].data[dataIndex].Mode
    var color = activityToColor[mode]

    modeColors.push(color);
    emissionsColors.push(getEmissionsColor(data[dayIndex].data[dataIndex].Emissions));

    var decodedPath = google.maps.geometry.encoding.decodePath(path); 
    var decodedLevels = decodeLevels(levels);
    var newLine = new google.maps.Polyline({
        path: decodedPath,
        levels: decodedLevels,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: null
    });
    return newLine;
}



function addPolylines(dayLines){ //array of polylines for a single day
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].setMap(map);
    }
}

function removePolyLines(dayLines){
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].setMap(null);
    }
}

function setBounds(dayLines){
    for (var i=0; i < dayLines.length; i++){
        dayLines[i].getPath().forEach(function(LatLng) {
            bounds.extend(LatLng);
        });
    }
    map.fitBounds(bounds);
}


function updateMultiday(dayIndex, visibility = True){
        // console.log(visibility);

    if (visibility){
        addPolylines(lines[dayIndex]);
        setBounds(lines[dayIndex]);
    }
    else{
        removePolyLines(lines[dayIndex]);
        bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < lines.length; i++){
            for (var j = 0; j < lines[i].length; j++){
                if (lines[i][j].map == map){
                    setBounds(lines[i])
                } 
            }
        }

    }

}

function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}

$(window).on('load', function() {
    $.getJSON( "data/gps.json", function(data) {

        data = data;

        for (var i = 0; i < data.length; i++){

            document.getElementById("" + i).value = data[i].day;
            // console.log(document.getElementById(""+ i).value);
            
        }
    });
});


function toggleColor(){
    var elem = document.getElementById("toggleColor");

    if (elem.value=="Color by Emissions") {
        elem.value = "Color by Mode";

        //Color by Mode
        var counter=0;

        for (var i = 0; i < lines.length; i++){
            for (var j = 0; j < lines[i].length; j++){
                // console.log(counter);

                lines[i][j].setOptions({strokeColor: emissionsColors[counter]});
                // console.log(lines[i][j]);
    
                counter++;
            }
        }
    }
    //Color By Emissions
    else {
        elem.value = "Color by Emissions";
        var counter=0;
        for (var i = 0; i < lines.length; i++){
            for (var j = 0; j < lines[i].length; j++){
                lines[i][j].setOptions({strokeColor: modeColors[counter]});
                // console.log(lines[i][j]);
        
                counter++;
            }
        }
    };
}

function getEmissionsColor(e){
    emissions = +e;
    if (emissions > 0.08){
        return "#FF0000"
    }
    else if (emissions > 0.05){
        return "#FFA500"
    }
    else if (emissions > 0.02){
        return "#FFFF00"
    }
    else {
        return "#008000"
    }
}


