$("#visualizationType").append(cols.reduce(function (total, currentValue, currentIndex, arr) {
    return currentIndex > 1 && currentValue.type == "number" ? total + "<option value=" + currentIndex + " data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
}, ""));


$("#chartsCategory").change(function () {
    var charts = chartsCategoryMapping[$(this).val()];
    var html = "";
    for (var i = 0; i < charts.length; i++) {
        html += "<div><img src='thumbnails/" + charts[i] + ".png' width=200 height=100><br>" + charts[i] + "</div>";


    }

    $("#chartsAvailable").html(html);
    var imgs = $("#chartsAvailable").find("img");

    checkifImgsLoaded(imgs);


});

function checkifImgsLoaded(imgs) {


    for (var i = 0; i < imgs.length; i++) {
        if (!imgs.eq(i)[0].complete) {

            return setTimeout(checkifImgsLoaded, 200, imgs);

        }

    }

    $("#showVisualization").click().click();


}




$("#chartsAvailable").on("click", "div", function () {


    var previousChart = $(".activeChart").eq(0).text();

    $(this).siblings().removeClass("activeChart");
    $(this).addClass("activeChart");
    $("#chartArea").html("");

    var activeChart = $(this).text();


    if (activeChart == "Timeline") {

        $("#addChartColumn,#visualizationTypeDiv").hide();


        var html = "<div>";

        html += "<select>" + cols.reduce(function (total, currentValue, currentIndex, arr) {
            return currentIndex > 1 && currentValue.type != "date" ? total + "<option value=" + currentIndex + " data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
        }, "") + "</select>";
        html += "<select>" + cols.reduce(function (total, currentValue, currentIndex, arr) {
            return currentIndex > 1 && currentValue.type != "date" ? total + "<option value=" + currentIndex + " data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
        }, "") + "</select>";
        html += "<select>" + cols.reduce(function (total, currentValue, currentIndex, arr) {
            return currentIndex > 1 && currentValue.type != "date" ? total + "<option value=" + currentIndex + " data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
        }, "") + "</select>";

        html += "</div>";

        $("#chartColumns").html(html);

        return;
    }



    if ($("#chartColumns").children("div").eq(0).find("select").length == 3) {
        $("#chartColumns").html("");
        $("#addChartColumn,#visualizationTypeDiv").show();

    }



    if (activeChart == "Pie" || activeChart == "Donut" || activeChart == "Tree Map") {

        $("#chartColumns").find("input[type='color']").css("visibility", "hidden");
    }
    else {
        $("#chartColumns").find("input[type='color']").css("visibility", "visible");

    }


    if (activeChart == "Combo") {
        var comboSeriesTypeOptions = ['line', 'area', 'bars', 'candlesticks', 'steppedArea'];
        $(".options").html("<select class='comboSeriesType'><option>" + comboSeriesTypeOptions.join("</option><option>") + "</option></select>");
    }
    else {
        $(".options").html("");
    }


    if (allowMultiple.indexOf(activeChart) == -1) {

        var columnsDivs = $("#chartColumns").children("div");
        for (var i = 1; i < columnsDivs.length; i++) {

            columnsDivs.eq(i).remove();
        }

        $("#addChartColumn").hide();
    }
    else {

        $("#addChartColumn").show();
    }


    if ($("#chartColumns").children("div").length == 0) {
        $("#addChartColumn").click();
    }


    $("#showVisualization").click().click();
    drawChart();

})

$("#addChartColumn").click(function () {

    var div = "<div>";
    div += "<select class=''>" + cols.reduce(function (total, currentValue, currentIndex, arr) {
        return currentIndex > 1 ? total + "<option value='" + currentIndex + "' data-type='" + currentValue.type + "'>" + currentValue.label + "</option>" : total;
    }, "<option value disabled selected>--Please select a column--</option>") + "</select>";


    div += "<input type='color'>";

    div += "<div class='options'></div><button class='deleteColumn'><i class='fas fa-trash-alt'></i></button>";

    div += "</div>";



    $("#chartColumns").append(div);

    var activeChart = $(".activeChart").eq(0).text();
    if (activeChart == "Pie" || activeChart == "Donut" || activeChart == "Tree Map") {

        $("#chartColumns").find("input[type='color']").css("visibility", "hidden");

    }
    else {
        $("#chartColumns").find("input[type='color']").css("visibility", "visible");


    }


    if (activeChart == "Combo") {
        var comboSeriesTypeOptions = ['line', 'area', 'bars', 'candlesticks', 'steppedArea'];
        $(".options:last").html("<select class='comboSeriesType'><option>" + comboSeriesTypeOptions.join("</option><option>") + "</option></select>");
    }
    else {
        $(".options").html("");
    }




    $("#showVisualization").click().click();
});


$("#chartColumns").on("click", ".deleteColumn", function () {

    $(this).closest("div").remove();
    if ($("#chartColumns").children("div").length == 0) {
        $("#addChartColumn").click();
    }
    drawChart();

});

$("#chartColumns,#visualizationTypeDiv").on("change", "input,select", function () {

    drawChart();


});


function drawChart(array) {

    array = array || redrawTable(true);

    var activeChart = $(".activeChart").text();

    if (activeChart == "Timeline") {

        var columnsSelects = $("#chartColumns").find("select");

        var data = [];

        data.push([
            cols[columnsSelects.eq(0).val()].label,
            cols[columnsSelects.eq(1).val()].label,
            cols[columnsSelects.eq(2).val()].label
        ]);

        for (var i = 0; i < array.length; i++) {
            data.push([
                array[i][columnsSelects.eq(0).val()],
                array[i][columnsSelects.eq(1).val()],
                array[i][columnsSelects.eq(2).val()]
            ]);


        }



    }
    else {
        var columnsDivs = $("#chartColumns").children("div");


        var obj = {};

        var colors = [];

        var columnsToDraw = [];

        for (var i = 0; i < columnsDivs.length; i++) {


            var columnSelected = columnsDivs.eq(i).find("select").eq(0).val();
            if (!columnSelected) continue;
            colors.push(columnsDivs.eq(i).find("input").eq(0).val());


            columnsToDraw.push(parseInt(columnsDivs.eq(i).find("select").eq(0).val(), 10));

        }
        if (columnsToDraw.length == 0) return $("#chartArea").html("");


        if ($("#visualizationType").val() == "Total occurrences") {

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






        }

        else {
            var data = [["Label"]];

            for (var i = 0; i < columnsToDraw.length; i++) {
                data[0].push($("#visualizationType").find("option:selected").text() + " for " + cols[columnsToDraw[i]].label);
            }


            for (var i = 0; i < array.length; i++) {

                for (var j = 0; j < columnsToDraw.length; j++) {

                    var row = [array[i][columnsToDraw[j]]];

                    for (var k = 0; k < columnsToDraw.length; k++) {
                        row.push(null);
                    }

                    row[j + 1] = array[i][$("#visualizationType").val()];
                    data.push(row);
                }
            }




        }



        if (activeChart == "Tree Map") {
            data[0].splice(1, 0, "Parent");
            data.splice(1, 0, ["All records", null, 0])
            for (var i = 2; i < data.length; i++) {

                data[i].splice(1, 0, "All records");
            }
        }
    }



    var view = google.visualization.arrayToDataTable(data);


    var options = {
        colors: colors,
        height: 600
    };


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

        var comboTypes = $(".comboSeriesType");
        options["series"] = [];
        for (var i = 0; i < comboTypes.length; i++) {

            options["series"].push({ type: comboTypes.eq(i).val() })
        }


    }
    else if (activeChart == "Donut") {
        var chart = new google.visualization.PieChart(document.getElementById("chartArea"));
        options["pieHole"] = 0.4;
        delete options["colors"];
    }
    else if (activeChart == "Pie") {
        var chart = new google.visualization.PieChart(document.getElementById("chartArea"));
        delete options["colors"];

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
    else if (activeChart == "Line Sharp") {
        var chart = new google.visualization.LineChart(document.getElementById("chartArea"));

    }
    else if (activeChart == "Line Smooth") {
        var chart = new google.visualization.LineChart(document.getElementById("chartArea"));
        options["curveType"] = "function";
    }
    else if (activeChart == "Timeline") {
        var chart = new google.visualization.Timeline(document.getElementById("chartArea"));

    }
    else if (activeChart == "Scatter") {
        var chart = new google.visualization.ScatterChart(document.getElementById("chartArea"));

    }
    else if (activeChart == "Histogram") {
        var chart = new google.visualization.Histogram(document.getElementById("chartArea"));

    }
    else if (activeChart == "Geo") {
        var chart = new google.visualization.GeoChart(document.getElementById("chartArea"));

    }
    else if (activeChart == "Map") {
        var chart = new google.visualization.Map(document.getElementById("chartArea"));

    }
    chart.draw(view, options);

    $("#showVisualization").click().click();





}


var chartsCategoryMapping = {

    "Comparison": ["Area", "Stepped Area", "Bar", "Column"],
    "Composition": ["Bar", "Column", "Combo", "Donut", "Pie", "Stacked bar", "Tree Map", "Word"],
    "Process": ["Area", "Stepped Area", "Line Sharp", "Line Smooth", "Timeline"],
    "Relationship": ["Combo", "Scatter", "Tree Map", "Word"],
    "Distribution": ["Area", "Stepped Area", "Column", "Histogram", "Scatter", "Stacked bar"],
    "Geography": ["Geo", "Map"]



}
var allowMultiple = ["Area", "Stepped Area", "Bar", "Column", "Combo", "Histogram", "Line Sharp", "Line Smooth", "Scatter", "Stacked bar", "Timeline"];













