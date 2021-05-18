//Handles login button event
$('#login-btn').click(function() {
    //get username and password values from DOM
    var username = $('#username').val();
    var password = $('#password').val();

    console.log(username);
    console.log(password);

    //check for username/password validity
    if (username == "admin" && password == "p@ssword") {
        
        //if correct, set a key in localStorage named "login" with value of 1
        //it will be the flag if the user is logged in or not
        localStorage.setItem("login", 1);

        //after setting the flag, check login status
        checkIfLoggedIn();
    } else {
        $('#login-error').show();
        $('#username').val("");
        $('#password').val("");
    }
});

function checkIfLoggedIn() {

    //get the value of the login flag from localStorage with the key "login"
    var loginStatus = localStorage.getItem('login');

    //if the value of the flag is 1, then someone has logged in, redirect them to dashboard.html
    if (loginStatus == 1) {
        //but first, check if the user already in dashboard.html before redirecting
        //to avoid infinite redirections
        if (!window.location.href.includes("dashboard.html")) { //checks if the url contains the keyword "dashboard.html"
            //if the url does not contain dashboard.html, then redirect to dashboard.html
            window.location.href = "dashboard.html";
        }
    } else { //else redirect to index.html or the login page
        //but first, check if the user already in index.html before redirecting
        //to avoid infinite redirections
        if (!window.location.href.includes("index.html")) { //checks if the url contains the keyword "index.html"
            //if the url does not contain index.html, then redirect to index.html
            window.location.href = "index.html";
        }
    }
}

//initial check if a user is logged in or not
checkIfLoggedIn();

//event handler for logout button
$('#logout-btn').click(function() {
    //if clicked, then clear the login flag from localStorage with the key "login"
    localStorage.removeItem("login");
    //after clearing the "login" key, run the login check
    //to redirect user to index.html, since the "login" flag from localStorage is now cleared or not 1
    checkIfLoggedIn();
});

//set the volume for the background music
//get the document element
var audio = document.getElementById("player");
if (audio) {
    //set the volume property
    audio.volume = 0.05;
}

//google charts api
//load the following packages, 'bar','line' because we are going to use this charts in this project
//also load corecharts so we can use basic charts api
google.charts.load('current', { 'packages': ['bar', 'corechart', 'line'] });

//setting the callback function when google chart is done loading
//in this case, the function "drawChart" will be called when google charts is done loading
google.charts.setOnLoadCallback(drawChart);

//initialize global variables for our charts, so we can access the charts anywhere in our code

//burger by species chart variable
var burgerBySpeciesChart = null;

//burger by sales chart variable
var burgerSalesChart = null;

//sales by specie chart variable
var salesBySpecieChart = null;

//sales by burger & time chart variable
var burgerSalesByTimeChart = null;

//sales by specie & time
var specieSalesByTimeChart = null;


//chart options for burger by species chart
var burgerBySpeciesChartOptions = {
    title: 'Burger by Specie',
    titleTextStyle: { color: '#573e7c', fontName: 'Century Gothic', bold: true, fontSize: '20' },
    theme: 'material',
    animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
    },
    height: 500,
    bar: { groupWidth: "80%" },
    vAxis: {
        title: 'Burgers',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    },
    hAxis: {
        title: 'Sales',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    }

};

//chart options for burger by sales chart
var burgerSalesChartOptions = {
    title: 'Burger Sales',
    titleTextStyle: { color: '#573e7c', fontName: 'Century Gothic', bold: true, fontSize: '20' },
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
    },
    vAxis: {
        title: 'Burgers',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    },
    hAxis: {
        title: 'Sales',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    }
};

var saleBySpecieOption = {
    title: 'Sales by Specie',
    titleTextStyle: { color: '#573e7c', fontName: 'Century Gothic', bold: true, fontSize: '20' },
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    },
    hAxis: {
        title: 'Species',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    }
};

var burgerSalesByTimeChartOptions = {
    title: 'Burger sales by date',
    titleTextStyle: { color: '#573e7c', fontName: 'Century Gothic', bold: true, fontSize: '20' },
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 500,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    },
    hAxis: {
        title: 'Time',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
        format: 'hh a'
    }
}

var specieSalesByTimeChartOptions = {
    title: 'Specie sales by date',
    titleTextStyle: { color: '#573e7c', fontName: 'Century Gothic', bold: true, fontSize: '20' },
    theme: 'material',
    height: 400,
    animation: {
        "startup": true,
        duration: 500,
        easing: 'out'
    },
    vAxis: {
        title: 'Sales',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
    },
    hAxis: {
        title: 'Time',
        titleTextStyle: { fontName: 'Century Gothic', fontSize: '16' },
        format: 'hh a'
    }
}


/*
    function to draw initially the charts
    burger by species chart
    burger by sales chart 
    sales by specie chart
    burger sales by date chart and
    specie sales by date chart
    base on the charts data
    the user has uploaded
*/
function drawChart() {

    //initialize chart data for chart burger by species
    var data = google.visualization.arrayToDataTable([
        ['Burgers', 'Species'], //chart legends
        [0, 0] //initial data, 0 for burgers & 0 for species
    ]);

    //initialize bar chart for burger by species chart
    burgerBySpeciesChart = new google.visualization.BarChart($('#burger-by-species-chart')[0]);

    //then draw the chart to the DOM with the initial data and chart options
    burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);

    //initialize chart data for chart burger by sales
    data = google.visualization.arrayToDataTable([
        ['Burgers', 'Sales'], //chart legends
        [0, 0] //initial data, 0 for burgers & 0 for sales
    ]);

    //initialize bar chart for burger by sales chart
    burgerSalesChart = new google.visualization.BarChart($('#burger-sales-chart')[0]);

    //then draw the chart to the DOM with the initial data and chart options
    burgerSalesChart.draw(data, burgerSalesChartOptions);

    //initialize chart data for chart burger by sales
    data = google.visualization.arrayToDataTable([
        ['Specie', 'Burger'], //chart legends
        [0, 0]
    ]);

    //initialize column chart for burger by sales chart
    salesBySpecieChart = new google.visualization.ColumnChart($('#sales-by-specie-chart')[0]);

    //then draw the chart to the DOM with the initial data and chart options
    salesBySpecieChart.draw(data, saleBySpecieOption);

    //initialize chart data for chart burger sales by date
    data = new google.visualization.DataTable();

    //legend for time of day
    data.addColumn('timeofday', 'Time of Day');
    //legend for sales
    data.addColumn('number', 'Sales');

    burgerSalesByTimeChart = new google.visualization.LineChart($('#burger-sales-by-time-chart')[0]);
    burgerSalesByTimeChart.draw(data, burgerSalesByTimeChartOptions);

    data = new google.visualization.DataTable();

    data.addColumn('timeofday', 'Time of Day');
    data.addColumn('number', 'Sales');

    specieSalesByTimeChart = new google.visualization.LineChart($('#specie-sales-by-time-chart')[0]);

    refreshCharts();
}

var dates = {}; //global variable for reconstructed sales data

/*
    structure:

    {
        @date : {
            @hour : [@sales_entry1, @sales_entry2]
        }
    }

    sample:

    dates = {
        '2019-07-01' : {
            '08' : [
                { 
                    'datetime': '2019-07-01 08:00:32',
                    'species' : 'Krab',
                    'burger'  : 'Krabby Patty'
                }
            ]
        }
    }
*/

//pad left with 0 or any character
String.prototype.padZero = function(len, c) {
    var s = this,
        c = c || '0';
    while (s.length < len) s = c + s;
    return s;
}

//global variable for current json data uploaded by the user
var currentJsonData = null;


/*
    function to redraw charts according to the uploaded charts data
    and add values to the date picker according to the available sales dates
*/
function refreshCharts() {

    //get the chart data in a form of text uploaded by the user in the localStorage with the key "charts_data"
    var text = localStorage.getItem('charts_data');

    /*

        then parse the charts data text to JSON format and assign it to the global variable
        "currentJsonData" so we can manipulate and access the data anywhere
    */
    currentJsonData = $.parseJSON(text);

    //destroy date picker so we can add new data
    $('#date-select').datepicker('destroy');

    //reinitialize global variable "dates", so we can add the sales data according to the uploaded chart data
    dates = {};

    /*
        initial charts data for
        burger by specie chart
        burger sales chart
        sales by specie chart
    */
    var data = [
        ['', ''], //legends
        [0, 0] //empty values for legend
    ];

    data = google.visualization.arrayToDataTable(data);

    //draw the charts initially with empty legends and no data
    burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);
    burgerSalesChart.draw(data, burgerSalesChartOptions);
    salesBySpecieChart.draw(data, google.charts.Bar.convertOptions(saleBySpecieOption));

    //$("#date-select").val($("#date-select option:eq(1)").val());
    //$("#date-select").trigger('change');

    //before redrawing the charts with the charts data, check first if there is any charts data available

    //if charts data is available
    if (text) {
            
        data = [];

        var json = $.parseJSON(text);


        var species = ['Burgers'];
        var saleEnties = [];

        console.log(json);

        //BURGER BY SPECIE DATA CONVERSION

        var colors2 = [
            '#7A9AE5', '#363475', '#1662AC', '#1E4696', '#6E5AB9', '#47A5EE', '#5683DC',
            '#84B3B3', '#297060', '#255232', '#405F60', '#40BA97', '#418753', '#64A29E',
            '#D59441', '#825B34', '#655B42', '#76451A', '#C5976D', '#A49578', '#BF762B',
        ];

        var j = 0;

        $.each(json['burger_by_species'], function(burger, sales_by_species) {
            var saleEntry = [];
            saleEntry.push(burger);
            $.each(sales_by_species, function(specie, sale) {
                if (species.indexOf(specie) == -1) {
                    species.push(specie);
                    //species.push({role: 'style'});
                }
                saleEntry.push(sale);
                //saleEntry.push(colors2[j]);
                j += 1;
                if (j == colors2.length) {
                    j = 0;
                }
            });
            saleEnties.push(saleEntry);
        });

        console.log(species);

        data.push(species);

        $.each(saleEnties, function(index, entry) {
            data.push(entry);
        });

        console.log(data);

        data = google.visualization.arrayToDataTable(data);
        burgerBySpeciesChart.draw(data, burgerBySpeciesChartOptions);


        //BURGER SALES DATA CONVERSION

        data = [];

        data.push(['Burger', 'Sales', { role: 'style' }]) //HEADER

        var color3 = ['#4652A0', '#E99EB0', '#142B70'];
        var k = 0;

        $.each(json['burger_sales'], function(burger, sales) {
            data.push([burger, sales, color3[k]]);
            k += 1;
            if (k == color3.length) {
                k = 0;
            }
        });

        console.log(data);

        data = google.visualization.arrayToDataTable(data);
        burgerSalesChart.draw(data, burgerSalesChartOptions);

        //SALES BY SPECIE DATA CONVERSION

        data = [];

        data.push(['Species', 'Sales', { "role": "style" }]); //HEADER

        var colors = ['#AEB6DF', '#AE89AB', '#9AB6BA', '#D1BAAF', '#D6A9D6', '#B492D9', '#90A1E6'];

        var i = 0;

        $.each(json['species_sales'], function(specie, sales) {
            data.push([specie, sales, /*getRandomColor()*/ colors[i]]);
            i += 1;
            if (i == colors.length) {
                i = 0;
            }
        });

        data = google.visualization.arrayToDataTable(data);
        salesBySpecieChart.draw(data, google.charts.Bar.convertOptions(saleBySpecieOption));

        //BURGER SALES BY DATETIME

        dates = {};

        //$('#date-select').html('');
        //$('#date-select').addOpt('Please select a date', '');

        var firstDate = null;

        $.each(json['sales'], function(sale_id, sale) {
            var date = sale.datetime.split(" ")[0];
            var time = sale.datetime.split(" ")[1];
            if (!dates.hasOwnProperty(date)) {
                dates[date] = {};
                if (firstDate == null) {
                    firstDate = date;
                }
                //$('#date-select').addOpt(date, date);
            }
            var hour = time.split(':')[0];

            if (!dates[date].hasOwnProperty(hour.toString())) {
                dates[date][hour.toString()] = [];
            }

            dates[date][hour.toString()].push({
                burger: sale.burger,
                specie: sale.species,
                time: time
            });
        });

        $('#date-select').datepicker({
            format: "yyyy-mm-dd",
            beforeShowDay: function(date) {
                var fullDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padZero(2) + '-' + date.getDate().toString().padZero(2);
                if (dates.hasOwnProperty(fullDate)) {
                    return {
                        enabled: true
                    };
                }
                return {
                    enabled: false
                };
            }
        });

        if (firstDate != null) {
            $('#date-select').datepicker('update', firstDate);
        }

        //$("#date-select").val($("#date-select option:eq(1)").val());
        //$("#date-select").trigger('change');
    }
}

$('#chart-type').on('change', function(){
    $('#date-select').trigger('change');
});

$('#date-select').on('change', function() {


    var data = new google.visualization.DataTable();
    var dataSpecie = new google.visualization.DataTable();

    data.addColumn('datetime', 'Time of Day');
    data.addColumn('number', 'Sales');

    dataSpecie.addColumn('datetime', 'Time of Day');
    dataSpecie.addColumn('number', 'Sales');

    var chartType = $('#chart-type').val();

    if(chartType == 1){
        burgerSalesByTimeChart = new google.visualization.LineChart($('#burger-sales-by-time-chart')[0]);
        specieSalesByTimeChart = new google.visualization.LineChart($('#specie-sales-by-time-chart')[0]);
    }else{
        burgerSalesByTimeChart = new google.visualization.ColumnChart($('#burger-sales-by-time-chart')[0]);
        specieSalesByTimeChart = new google.visualization.ColumnChart($('#specie-sales-by-time-chart')[0]);
    }

    burgerSalesByTimeChart.draw(data, google.charts.Line.convertOptions(burgerSalesByTimeChartOptions));
    specieSalesByTimeChart.draw(dataSpecie, google.charts.Line.convertOptions(specieSalesByTimeChartOptions));


    if (!$(this).val()) {
        return;
    }

    var burgerTypes = [];
    var burgerSales = {};

    var specieTypes = [];
    var specieSales = {};

    $.each(dates[$(this).val()], function(time, sales) {
        if (!burgerSales.hasOwnProperty(time)) {
            burgerSales[time] = {};
        }

        if (!specieSales.hasOwnProperty(time)) {
            specieSales[time] = {};
        }

        $.each(sales, function(index, sale) {
            if (burgerTypes.indexOf(sale.burger) == -1) {
                burgerTypes.push(sale.burger);
            }

            if (specieTypes.indexOf(sale.specie) == -1) {
                specieTypes.push(sale.specie);
            }

            if (!burgerSales[time].hasOwnProperty(sale.burger)) {
                burgerSales[time][sale.burger] = 0;
            }

            if (!specieSales[time].hasOwnProperty(sale.specie)) {
                specieSales[time][sale.specie] = 0;
            }

            if (burgerSales.hasOwnProperty(time) && burgerSales[time].hasOwnProperty(sale.burger)) {
                burgerSales[time][sale.burger] += 1;
            }
            if (specieSales.hasOwnProperty(time) && specieSales[time].hasOwnProperty(sale.specie)) {
                specieSales[time][sale.specie] += 1;
            }
        });
    });

    burgerTypes.sort();

    specieTypes.sort();

    $.each(burgerTypes, function(i, burger) {
        data.addColumn('number', burger);
    });

    $.each(specieTypes, function(i, specie) {
        dataSpecie.addColumn('number', specie);
    });

    var rows = [];
    var specieSalesByTimeRows = [];

    var dateParts = $(this).val().split('-');

    $.each(dates[$(this).val()], function(time, sales) {

        if (!time) {
            return true;
        }
        if (!sales) {
            return true;
        }

        var row = [new Date(dateParts[0], dateParts[1] - 1, dateParts[2], parseInt(time)), sales.length];

        var specieSalesRow = [new Date(dateParts[0], dateParts[1] - 1, dateParts[2], parseInt(time)), sales.length];

        $.each(burgerTypes, function(i, burger) {
            var burgerSold = 0;
            if (burgerSales.hasOwnProperty(time) && burgerSales[time].hasOwnProperty(burger)) {
                burgerSold = burgerSales[time][burger];
            }
            row.push(burgerSold);
        });

        $.each(specieTypes, function(i, specie) {
            var burgerSold = 0;
            if (specieSales.hasOwnProperty(time) && specieSales[time].hasOwnProperty(specie)) {
                burgerSold = specieSales[time][specie];
            }
            specieSalesRow.push(burgerSold);
        });

        rows.push(row);
        specieSalesByTimeRows.push(specieSalesRow);
    });

    rows = rows.sort(function(a,b){
      return new Date(a[0]) - new Date(b[0]);
    });

    data.addRows(rows);

    specieSalesByTimeRows = specieSalesByTimeRows.sort(function(a,b){
      return new Date(a[0]) - new Date(b[0]);
    });

    dataSpecie.addRows(specieSalesByTimeRows);

    burgerSalesByTimeChart.draw(data, google.charts.Line.convertOptions(burgerSalesByTimeChartOptions));
    specieSalesByTimeChart.draw(dataSpecie, google.charts.Line.convertOptions(specieSalesByTimeChartOptions));

});


$.fn.addOpt = function(text, value) {
    $(this).append('<option value="' + value + '">' + text + '</option>');
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// $('#uploader').on('change', function(event) {

// });


$('#replace-button').click(function() {

    if (!$('#uploader').val()) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function(evt) {
        var text = evt.target.result;

        localStorage.setItem('charts_data', text);

        swal.fire("Upload complete!", "Data has been uploaded to tables and charts.", "success")
        //alert('Data has been uploaded.');

        refreshCharts();
        refreshTables();
    }

    reader.readAsText($('#uploader')[0].files[0]);

});

$.fn.addRows = function(data) {
    $(this).DataTable().rows.add(data).draw(false);
    return $(this);
};

$.fn.clearDataTable = function() {
    $(this).DataTable().clear().draw();
    return $(this);
};

$('#sales-table').DataTable({
    "paging": true,
    "searching": true,
    order: [
        [0, "desc"]
    ],
    "columns": [
        { "name": "Date", 'data': "datetime" },
        { "name": "Burger", "data": "burger" },
        { "name": "Specie", "data": "species" },
    ]
});

var burgerSalesBySpecieTable = $('#burger-sales-by-specie-table');

burgerSalesBySpecieTable.DataTable();

$('#burger-sales-table').DataTable();

$('#species-sales-table').DataTable();


function refreshTables() {
    $('#sales-table').clearDataTable();
    burgerSalesBySpecieTable.clearDataTable();
    $('#burger-sales-table').clearDataTable();
    $('#species-sales-table').clearDataTable();

    var text = localStorage.getItem('charts_data');

    if (text) {

        var chartsData = $.parseJSON(text);

        var sales = [];

        $.each(chartsData['sales'], function(id, sale) {
            sales.push(sale);
        });

        var burgerByspecieTableData = [];

        var specieSaleTableData = [];

        //[burger, specie, sales]
        //[krabby pattie, coral, 18]
        //[krabby pattie, giant clam, 199]

        $.each(chartsData['burger_by_species'], function(burger, specie_sales) {
            $.each(specie_sales, function(specie, sales) {

                var row = [];

                row.push(burger);
                row.push(specie);
                row.push(sales);

                burgerByspecieTableData.push(row);
            });
        });

        var burgerSalesTableData = [];

        //[burger, sales]

        $.each(chartsData['burger_sales'], function(burger, sales) {
            var row = [burger, sales];
            burgerSalesTableData.push(row);
        });

        $.each(chartsData['species_sales'], function(specie, sales) {
            var row = [specie, sales];
            specieSaleTableData.push(row);
        });

        $('#sales-table').addRows(sales);
        burgerSalesBySpecieTable.addRows(burgerByspecieTableData);
        $('#burger-sales-table').addRows(burgerSalesTableData);
        $('#species-sales-table').addRows(specieSaleTableData);
    }
}

refreshTables();

$('#clear-button').click(function() {

    Swal.fire({
        title: 'Are you sure you want to clear data?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            localStorage.removeItem('charts_data');
            refreshTables();
            refreshCharts();
            Swal.fire(
                'Cleared!',
                'Data has been cleared.',
                'success'
            )

        }
    })


    //var r = //confirm("Clear data?");
    /* if (r == true) {
         localStorage.removeItem('charts_data');
         refreshTables();
         refreshCharts();
     }*/

});

$('#merge-button').click(function() {
    if (!$('#uploader').val()) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function(evt) {
        var text = evt.target.result;

        var json = $.parseJSON(text); //json to be merged

        var currentData = localStorage.getItem('charts_data');

        if (text) {
            swal.fire("Merge complete!", "Data has been merged.", "success");

            var currentJson = $.parseJSON(currentData);

            console.log(json);
            console.log(currentJson);

            if (json.hasOwnProperty('burger_by_species')) {
                $.each(json['burger_by_species'], function(burger, sales) {
                    if (currentJson['burger_by_species'].hasOwnProperty(burger)) {
                        $.each(json['burger_by_species'][burger], function(specie, salesValue) {
                            if (currentJson['burger_by_species'][burger].hasOwnProperty(specie)) {
                                currentJson['burger_by_species'][burger][specie] += salesValue;
                            } else {
                                currentJson['burger_by_species'][burger][specie] = salesValue;
                            }
                        });
                    } else {
                        currentJson['burger_by_species'][burger] = sales;
                    }
                });
            }

            if (json.hasOwnProperty('burger_sales')) {
                $.each(json['burger_sales'], function(burger, sales) {
                    if (currentJson['burger_sales'].hasOwnProperty(burger)) {
                        currentJson['burger_sales'][burger] += sales;
                    } else {
                        currentJson['burger_sales'][burger] = sales;
                    }
                });
            }

            if (json.hasOwnProperty('species_sales')) {
                $.each(json['species_sales'], function(specie, sales) {
                    if (currentJson['species_sales'].hasOwnProperty(specie)) {
                        currentJson['species_sales'][specie] += sales;
                    } else {
                        currentJson['species_sales'][specie] = sales;
                    }
                });
            }

            if (json.hasOwnProperty('sales')) {
                $.each(json['sales'], function(id, saleInfo) {

                    var id = makeid(10);

                    while (currentJson['sales'].hasOwnProperty(id)) {
                        id = makeid(10);
                    }

                    currentJson['sales'][id] = saleInfo;
                });
            }

            currentData = JSON.stringify(currentJson);
            localStorage.setItem('charts_data', currentData);
        } else {
            localStorage.setItem('charts_data', text);
        }

        //localStorage.setItem('charts_data', text);

        //swal.fire("Upload complete!", "Data has been uploaded to tables and charts.", "success")
        //alert('Data has been uploaded.');

        refreshCharts();
        refreshTables();
    }

    reader.readAsText($('#uploader')[0].files[0]);
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}