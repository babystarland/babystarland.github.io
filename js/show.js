
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
 * Print the names and majors of students in a sample spreadsheet:
 */
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
}
function showResult() {
    cleanPre();
    appendPre('會員編號, 資料建立時間, 類別, 內容');
    for (i = 0; i < allResult.values.length; i++) {
        var row = allResult.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        if(searchSelect.value == "id"){
            if(row[0] == searchContent.value){
                appendPre(row.join());
            }
        }
        else{
            if(searchSelect.value == row[2]){
                appendPre(row.join());
            }
        }
    }
}