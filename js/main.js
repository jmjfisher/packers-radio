//function to instantiate the Leaflet map
function createMap(){
    
    $('#button').click(function(){
        $('#overlay').css("display","none")
    });
    
    var broswerWidth = $(window).width();
    var zoom = 7;
    console.log(broswerWidth)
    if (broswerWidth <= 786){
            var zoom = 6
        };
    
    var map = L.map('mapid', {
        maxZoom: 18,
        zoomControl: true
    }).setView([44.75, -89.6], zoom);
   
    var streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam1qZmlzaGVyIiwiYSI6ImNqYXVlNDg3cDVhNmoyd21oZ296ZXpwdWMifQ.OGprR1AOquImP-bemM-f2g').addTo(map);
    
    L.control.locate({
        position: 'bottomright',
        flyTo: true,
        locateOptions: {
            maxZoom: 9
        }
    }).addTo(map);
    
    L.easyButton('fa-question-circle', function(btn, map){
        $('#overlay').css("display","block")
    },'Help',{position: 'topleft'}).addTo(map);
    
    //use queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.json, "data/master.topojson")
        .defer(d3.csv, "data/radio.csv")
        .await(callback);
    
    function callback (error,masterTopo,radioCSV) {
        
        function stationName(feature,layer){
            
            var popupContent = "<b>Station(s)</b>";
            
            var geoid = feature.properties['GEOID'];
            for (i=0; i<radioCSV.length; i++){
                if (radioCSV[i]["GEOID"]==geoid){
                    popupContent += '<br><b>'+radioCSV[i]["NUM"]+' '+radioCSV[i]["FRQ"]+'</b> '+radioCSV[i]["STATION"]+' '+radioCSV[i]["MARKET"]+', '+radioCSV[i]["ST"]
                };
            }
            layer.bindPopup(popupContent, {
                offset: [0,-7],
                direction: 'top',
                className: 'popupStation'});
        }; // end of  stationNAME
        
        //grab the features from the topojson
        var polygons = topojson.feature(masterTopo, masterTopo.objects.master).features;

        //call function to get everything else available
        var outlineOptions = {
            color: "#203731",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0
        };
    
        L.geoJSON(polygons,{
            style: outlineOptions,
            onEachFeature: stationName
            }).addTo(map);

    };

    $(".leaflet-control-container").on('mousedown dblclick pointerdown wheel', function(ev){
        L.DomEvent.stopPropagation(ev);
    });
    
}; // end of createMap

$(document).ready(createMap);