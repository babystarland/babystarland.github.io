function appendPre(message) {
    var pre = document.getElementById('result');
    var resultContent = document.createTextNode(message + '\n');
    pre.appendChild(resultContent);
}

function cleanPre() {
    var pre = document.getElementById('result');
    while (pre.firstChild) {
        pre.removeChild(pre.firstChild);
    }
}

/**
 * Get Data from sheet API
 */
 /*
function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: githubURL.searchParams.get("spreadsheetId"),
        range: 'Data!A2:D',
    }).then(function(response) {
        cleanPre();
        var range = response.result;
        if (range.values.length > 0) {
            allResult = response.result;
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}*/
function showResult() {
    cleanPre();
    
    var cur = {};
    if(searchSelect.value == "會員編號"){
        for(var sheet_name in allData){
            var id_idx = allData[sheet_name]["headers"].indexOf("會員編號");
            for(var row in allData[sheet_name]["records"]){
                if(allData[sheet_name]["records"][row][id_idx] == searchContent.value){ 
                    for(var i = 0; i < allData[sheet_name]["headers"].length; i++){
                        cur[allData[sheet_name]["headers"][i]] = allData[sheet_name]["records"][row][i];
                    }
                    appendPre(JSON.stringify(cur, null, 4));
                }
            }
        }
        
        // processing history
        appendPre(babyHistory["headers"].join());
        chart_data["datasets"][0]["data"] = [0, 0, 0, 0, 0];
        var id_idx = babyHistory["headers"].indexOf("會員編號");
        for(var row in babyHistory["records"]){
            if(babyHistory["records"][row][id_idx] == searchContent.value){
                appendPre(babyHistory["records"][row].join());

                var cat_idx_in_header = babyHistory["headers"].indexOf("類別");
                var cat_idx = CATEGORY.indexOf(babyHistory["records"][row][cat_idx_in_header])
                chart_data["datasets"][0]["data"][cat_idx] += 1;
            }
        }
        myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: chart_data,
            options: {
                legend: {
                    position: 'top',
                },
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    else{}
}