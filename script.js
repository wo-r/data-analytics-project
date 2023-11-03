$(window).ready(async function () {await $.ajax({type: "get", url: "./config.json", dataType: "json", contentType: "application/json; charset=utf-8",
    success: async (_c) => {
        let csv;

        // get arkansas csv data
        await $.ajax({
            type: "get",
            url: `./csv/prices.csv`,
            dataType: "text",
            success: async (_a) => {
                csv = _a
            }
        })

        let table = $("#plot-lift");
        table.css({"position": "fixed", "top": "0", "bottom": "1rem", "left": "1rem", "right": "1rem", "background": "#e6e0ff"})
        $("#plot").css({"display": "flex", "height": "100vh"})

        // reads csv and decompiles it into readable data for
        // plotly to understand.
        let decompile = async (csv) => {
            // split each into a single array
            let new_csv = csv;
            let final = {
                //date: [],
                ar: [],
                us: []
            }

            // correctly split the data between the coincidental \n that exists next
            // to the end of each arrays comma.
            new_csv = new_csv.split("\n\n");

            // split inside each
            await $.each(new_csv.reverse(), function (_n) {
                _n = this.split(",");

                let date = new Date(`${_n[0].split("-")[0]}/${1}/${_n[0].split("-")[1]}`).toLocaleDateString("en-US", {
                    year: 'numeric', 
                    month: 'numeric', 
                    day: "numeric"
                });

                //final.date.push(_n[0]);
                final.ar.push((Math.round(100*_n[1])/100));    
                final.us.push((Math.round(100*_n[2])/100))
            })

            return final;
        }

        // get decomile data from both arrays
        let c = (await decompile(csv));

        // plot on line
        Plotly.newPlot($("#plot")[0], [
                {
                    x: c.ar,
                    y: c.us,
                    mode: 'markers',
                    type: 'scatter',
                    line: {color: "#5467e8"}
                }
            ],
            _c.layout,
            _c.settings
        )
    }
})});