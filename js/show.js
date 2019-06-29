
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
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
    appendPre('會員編號, 資料建立時間, 類別, 內容');
    // Print columns A and E, which correspond to indices 0 and 4.
    if(searchSelect.value == "會員編號"){
        for(var sheet_name in allData){
            for(var row in allData[sheet_name]["records"]){
                var cur = allData[sheet_name]["records"][row]
                if(cur["會員編號"] == searchContent.value){
                    appendPre(JSON.stringify(cur, null, 4));
                }
            }
        }
        
        // processing history
        appendPre(allHistory["headers"].join());
        chart_data["datasets"][0]["data"] = [0, 0, 0, 0, 0];
        for(var row in allHistory["records"]){
            var cur = allHistory["records"][row]
            var result = ""
            if(cur["會員編號"] == searchContent.value){
                for(var k in cur){
                    result += cur[k] + ","
                }
                appendPre(result);
                chart_data["datasets"][0]["data"][CATEGORY.indexOf(cur["類別"])] += 1;
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
        /*if(row[0] == searchContent.value){
            appendPre(row.join());
        }*/
    }
    else{
    }
}