$(window).ready(async function () { await $.ajax({type: "get", url: "./config.json", dataType: "json", contentType: "application/json; charset=utf-8",
    success: async (_c) => {
        let csv = [];

        // get arkansas csv data
        await $.ajax({
            type: "get",
            url: `./csv/arkansas.csv`,
            dataType: "text",
            success: async (_a) => {
                csv.push(_a)
            }
        })

        // get united states csv data
        await $.ajax({
            type: "get",
            url: `./csv/united-states.csv`,
            dataType: "text",
            success: (_u) => {
                csv.push(_u)
            }
        })

        // reads csv and decompiles it into readable data for
        // plotly to understand.
        let decompile = async (csv) => {
            // split each into a single array
            let new_csv = csv.split(",\r\n");
            let final = {
                x: [],
                y: []
            }

            // split inside each
            await $.each(new_csv.reverse(), function (_n) {
                _n = this.split(",");
                _n[1] = `${_n[1]}`;
                _n = [_n[1], _n[0], _n[2]];

                let date = new Date(`${_n[1]} ${_n[0]}`).toLocaleDateString("en-US", {
                    year: 'numeric', 
                    month: 'numeric', 
                    day: "numeric"
                });
                date = date.split("/");
                date = `${date[2]}-${date[0]}-${date[1]}`;

                final.x.push(date);
                final.y.push((Math.round(100*_n[2])/100))
            })

            return final;
        }

        // get decomile data from both arrays
        let ar_gas = (await decompile(csv[0])),
            us_gas = (await decompile(csv[1]));


        // plot on line
        Plotly.newPlot($("#plot")[0], [
                {
                    name: "Arkansas Gas",
                    x: ar_gas.x, 
                    y: ar_gas.y, 
                    mode: "lines",
                    type: "scatter", 
                    line: {color: "#5467e8"}
                },
                {
                    name: "U.S. Gas",
                    x: us_gas.x,
                    y: us_gas.y,
                    mode: "lines",
                    type: "scatter", 
                    line: {color: "#e38c56"}
                }
            ],
            _c.layout,
            _c.settings
        )
    }
})});