$(window).ready(async function () {
    let config_json = "",
        data_csv = "",
        data_2_csv = "",
        x_y = {
            x: [],
            y: []
        },
        x_y_2 = {
            x: [],
            y: []
        }

    await $.ajax({
        type: "get",
        url: `./config.json`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: (config) => {
            config_json = config;
        }
    })
    
    await $.ajax({
        type: "get",
        url: `./ar-gas.csv`,
        dataType: "text",
        success: (data) => {
            data_csv = data;
        }
    })

    await $.ajax({
        type: "get",
        url: `./ww-gas.csv`,
        dataType: "text",
        success: (data) => {
            data_2_csv = data;
        }
    })

    // split and read csv data from my format
    // this makes the reading of the cvs a whole lot more easy
    data_csv = data_csv.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'');
    data_csv = data_csv.replace(/(\r\n|\n|\r)/gm, "");
    data_csv = data_csv.split(",") // YEAR | MONTH | MONEY
    console.log(data_csv)
    $.each(data_csv, function (new_data_csv) {
        // split between space
        new_data_csv = this.replace("\n", "").replace("$", "").split(" ");
        new_data_csv[1] = `${new_data_csv[1]}`
        new_data_csv = [new_data_csv[1], new_data_csv[0], new_data_csv[2]]

        if (new_data_csv[0] == undefined)
            return;

        let date = new Date(`${new_data_csv[1]} ${new_data_csv[0]}`).toLocaleDateString("en-US", {year: 'numeric', month: 'numeric', day: "numeric"})
        date = date.split("/");
        date = `${date[2]}-${date[0]}-${date[1]} 00:00:00`;

        // now we append the X and Y data
        x_y.x.push(date)
        x_y.y.push(new_data_csv[2]);
    })

        // split and read csv data from my format
    // this makes the reading of the cvs a whole lot more easy
    data_2_csv = data_2_csv.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'');
    data_2_csv = data_2_csv.replace(/(\r\n|\n|\r)/gm, "");
    data_2_csv = data_2_csv.split(",") // YEAR | MONTH | MONEY
    console.log(data_2_csv)
    $.each(data_2_csv, function (new_data_csv) {
        // split between space
        new_data_csv = this.replace("\n", "").replace("$", "").split(" ");
        new_data_csv[1] = `${new_data_csv[1]}`
        new_data_csv = [new_data_csv[1], new_data_csv[0], new_data_csv[2]]

        if (new_data_csv[0] == undefined)
            return;

        let date = new Date(`${new_data_csv[1]} ${new_data_csv[0]}`).toLocaleDateString("en-US", {year: 'numeric', month: 'numeric', day: "numeric"})
        date = date.split("/");
        date = `${date[2]}-${date[0]}-${date[1]} 00:00:00`;

        // now we append the X and Y data
        x_y_2.x.push(date)
        x_y_2.y.push(new_data_csv[2]);
    })

    console.log(x_y, x_y_2)
    
    Plotly.newPlot($("#plot")[0], [
            {
                name: "Arkansas Gas",
                x: x_y.x, 
                y: x_y.y, 
                mode: "lines",
                type: "scatter", 
                line: {color: "#5467e8"}
            },
            {
                name: "U.S. Gas",
                x: x_y_2.x,
                y: x_y_2.y,
                mode: "lines",
                type: "scatter", 
                line: {color: "#e38c56"}
            }    
        ],
        {
            title: config_json.title,
            font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'black',
            },
            yaxis: {
                fixedrange: true,
                autorange: true,
                title: {
                    text: "Gas price in $"
                }
            },
            xaxis: {
                fixedrange: true,
                autorange: true,
                title: {
                    text: "Year"
                }
            }
        },
        config_json.settings
    );
})