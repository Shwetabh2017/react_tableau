import React from 'react'


 function ComponentFun() {
    const tableau = window;
    (function () {
        var myConnector = tableau.makeConnector();
      
        myConnector.getSchema = function (schemaCallback) {
          const covidCols = [
            {
              id: "Date_of_report",
              dataType: tableau.dataTypeEnum.date,
            },
            {
              id: "Municipality_code",
              dataType: tableau.dataTypeEnum.string,
            },
            {
              id: "Municipality_name",
              dataType: tableau.dataTypeEnum.string,
            },
            {
              id: "Province",
              dataType: tableau.dataTypeEnum.string,
            },
            {
              id: "Total_reported",
              dataType: tableau.dataTypeEnum.int,
            },
            {
              id: "Hospital_admission",
              dataType: tableau.dataTypeEnum.int,
            },
            {
              id: "Deceased",
              dataType: tableau.dataTypeEnum.int,
            },
          ];
      
          let covidTableSchema = {
            id: "RIVM",
            alias: "Dutch Corona Cases since start - Simple example by Shwetabh",
            columns: covidCols,
          };
      
          schemaCallback([covidTableSchema]);
        };
      
        myConnector.getData = function (table, doneCallback) {
          let tableData = [];
          let i = 0;


           
      
             fetch(`data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json`)
            .then((res) => res.json())
            .then((data) => {
                let resp = data.result;
             console.log(data.results);
             let len = 1000;
 
              // Iterate over the JSON object
              //for (i = 0, len = resp.length; i < len; i++) {
                  for (i = 0, len; i < len; i++) {
                tableData.push({
                  Date_of_report: resp[i].Date_of_report,
                  Municipality_code: resp[i].Municipality_code,
                  Municipality_name: resp[i].Municipality_name,
                  Province: resp[i].Province,
                  Total_reported: resp[i].Total_reported,
                  Hospital_admission: resp[i].Hospital_admission,
                  Deceased: resp[i].Deceased,
                });
              }
              table.appendRows(tableData);
              doneCallback();
            }
          );
        };
      
        tableau.registerConnector(myConnector);
      })();

      function getData() {
        console.log("Getting data");
      tableau.connectionName = "Dutch Corona Case Numbers - Simple example by Shwetabh 1k  cases.";
      tableau.submit();
    }
    return (
        <div>
            <button onClick = { getData   }>Click to get data</button>
            
        </div>
    )
}

export default ComponentFun
