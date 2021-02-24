import React, { Component } from 'react';
import $ from 'jquery';



class TableauWDC extends Component {
    submit() {
        window.tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
        window.tableau.submit(); // This sends the connector object to Tableau
    }
    loadJSON(path, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr);
                }
            }
        };
        xhr.open("GET", "https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json", true);
        xhr.send();
    }
    componentDidMount() {
        let isReady = document.getElementById("tableauScript");
        isReady && this.setConnect()
    }
    setConnect() {
        var myConnector = window.tableau.makeConnector();
        myConnector.getSchema = function (schemaCallback) {
            window.tableau.log("getSchema")
            var cols = [{
                id: "id",
                dataType: window.tableau.dataTypeEnum.string
            }, {
                id: "mag",
                alias: "magnitude",
                dataType: window.tableau.dataTypeEnum.float
            }, {
                id: "title",
                alias: "title",
                dataType: window.tableau.dataTypeEnum.string
            }, {
                id: "location",
                alias: "shwetabh",
                dataType: window.tableau.dataTypeEnum.geometry
            }];

            var tableSchema = {
                id: "earthquakeFeed",
                alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
                columns: cols
            };

            schemaCallback([tableSchema]);
        };
        // Download the data
        myConnector.getData = function (table) {
            window.tableau.log("getData")
            
           // this.loadJSON('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
          
           
            // Where we're fetching data from
            $.getJSON(
                "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
                
           
           function (data) {
                    var feat = data.features,
                        tableData = [];
                              //Iterate over the JSON object
                    for (var i = 0, len = feat.length; i < len; i++) {
                        tableData.push({
                            "id": feat[i].id,
                            "mag": feat[i].properties.mag,
                            "title": feat[i].properties.title,
                            "location": feat[i].type
                        });
                    }
                   

                    table.appendRows(tableData);
                },
                function (xhr) { console.error(xhr); }
            );
        };

        
        window.tableau.registerConnector(myConnector);
       
    }


    render() {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }}>

                <button onClick={() => this.submit()} className="btn btn-success" >Get Earthquake Data!</button>

            </div>
        );
    }
}

export default TableauWDC;
