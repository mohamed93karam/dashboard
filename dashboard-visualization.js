$("#chartsCategory").change(function(){
    var charts = chartsCategoryMapping[$(this).val()];
    console.log(charts)
    var html = "";
    for (var i = 0; i < charts.length; i++) {
        html += "<div><img src='https://developers.google.com/chart/interactive/docs/gallery/images/icon-annotatedtimeline.png'><br>" + charts[i] + "</div>";


    }

    $("#chartsAvailable").html(html);
    $("#showVisualization").click().click();


});
$("#chartsAvailable").on("click", "div", function() {

    $(this).siblings().removeClass("activeChart");
    $(this).addClass("activeChart");
    $("#chartArea").html("");

    if ($("#chartColumns").find("div").length == 0) {
        $("#addChartColumn").click();
    }   
    drawChart();

})

$("#addChartColumn").click(function(){

    var div = "<div>";
    div += "<select class=''>" + cols.reduce(function (total, currentValue, currentIndex, arr) {
        return currentIndex > 1 ? total + "<option value='" + currentIndex + "' data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
    }, "<option value disabled selected>--Please select a column--</option>") + "</select>";


    div += "<input type='color'>";

    div += "<input type='text'><button class='deleteFilter'><i class='fas fa-trash-alt'></i></button></div>";

    div += "</div>";

    $("#chartColumns").append(div);
    $("#showVisualization").click().click();
});

$("#chartColumns").on("change", "input,select", function(){

    drawChart();


});


function drawChart(array) {

    array =  array || redrawTable(true);

    var columnsDivs = $("#chartColumns").find("div");
    
    var obj = {};

    var columnsToDraw = [];
    for (var i = 0; i < columnsDivs.length; i++) {
        var columnSelected = columnsDivs.eq(i).find("select").eq(0).val();
        if (!columnSelected) continue;
        columnsToDraw.push(parseInt(columnsDivs.eq(i).find("select").eq(0).val(), 10));

    }
    if (columnsToDraw.length == 0) return;
    console.log("columnsToDraw")
    console.log(columnsToDraw)

    for (var i = 0; i < array.length; i++) {

        for (var j = 0; j < columnsToDraw.length; j++) {

            if (!obj[array[i][columnsToDraw[j]]]) {
                
                obj[array[i][columnsToDraw[j]]] = [];

                for (var k = 0; k < columnsToDraw.length; k++) {
                    obj[array[i][columnsToDraw[j]]].push(0);
                }


            }

            obj[array[i][columnsToDraw[j]]][j]++;

        }
        

    }


    var data = [];

    var header = ["Label"];
    for (var i = 0; i < columnsToDraw.length; i++) {
        header.push(cols[columnsToDraw[i]].label + " Occurances");
    }

    data.push(header);

    for (var label in obj) {
        obj[label].unshift(label);

        data.push(obj[label]);

    }




    console.log(data);

    var view = google.visualization.arrayToDataTable(data);

    var activeChart = $(".activeChart").text();
    console.log(activeChart)

    var options = {};


    if (activeChart == "Area") {
        var chart = new google.visualization.AreaChart(document.getElementById("chartArea"));

    }
    else if (activeChart == "Stepped Area") {
        var chart = new google.visualization.SteppedAreaChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Bar") {
        var chart = new google.visualization.BarChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Column") {
        var chart = new google.visualization.ColumnChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Combo") {
        var chart = new google.visualization.ComboChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Donut") {
        var chart = new google.visualization.PieChart(document.getElementById("chartArea"));
        options["pieHole"] = 0.4;
    }
    else if (activeChart == "Pie") {
        var chart = new google.visualization.PieChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Stacked bar") {
        var chart = new google.visualization.BarChart(document.getElementById("chartArea"));
        options["isStacked"] = true;
    }
    else if (activeChart == "Tree Map") {
        var chart = new google.visualization.TreeMap(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Word") {
        var chart = new google.visualization.WordTree(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Stepped Area") {
        var chart = new google.visualization.AreaChart(document.getElementById("chartArea"));
        
    }
    else if (activeChart == "Stepped Area") {
        var chart = new google.visualization.AreaChart(document.getElementById("chartArea"));
        
    }
    chart.draw(view, options);

    $("#showVisualization").click().click();





}


var chartsCategoryMapping = {

    "Comparison" : ["Area", "Stepped Area", "Bar", "Column"],
    "Composition": ["Bar", "Column", "Combo", "Donut", "Pie", "Stacked bar", "Tree Map", "Word"]
    
    //"Geo", "Historgram", "Line Sharp", "Line Smooth", "Map",
     //"Scatter", ""
        
        
    
}