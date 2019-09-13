/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';

        searchHistoryDiv.style.display = 'block';
        callScriptFunction(["Data", "0-2", "2-3", "3-4", "5-6", "一年級", "二年級", "三年級", "四年級", "五年級"]);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';

        searchHistoryDiv.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    cleanPre();
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Calls an Apps Script function to get the data from the Google Sheet
 */
function callScriptFunction(sheet_list) {
    var request = {
        'function': 'getAllData',
        'parameters': {"name": sheet_list}
    };
    // Make the API request.
    var op = gapi.client.request({
        'root': 'https://script.googleapis.com',
        'path': 'v1/scripts/' + SCRIPT_ID + ':run',
        'method': 'POST',
        'body': request
    });
    op.execute(function(resp){ 
        handleGetDataResponse(resp);
    });
}
function handleGetDataResponse(resp) {
    if (resp.error && resp.error.status) {
        // The API encountered a problem before the script started executing.
        appendPre('Error calling API:');
        appendPre(JSON.stringify(resp, null, 2));
    } else if (resp.error) {
        // The API executed, but the script returned an error.
        // error contains: 'errorMessage' 'errorType', 'scriptStackTraceElements'
        var error = resp.error.details[0];
        appendPre('Script error message: ' + error.errorMessage);
        if (error.scriptStackTraceElements) {
            // There may not be a stacktrace if the script didn't start executing.
            appendPre('Script error stacktrace:');
            for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                var trace = error.scriptStackTraceElements[i];
                appendPre('\t' + trace.function+':' + trace.lineNumber);
            }
        }
    } else {
        //console.log(resp.response.result);
        for(var sheet_name in resp.response.result){
            if (sheet_name != "Data") {
                allData[sheet_name] = resp.response.result[sheet_name];
                var idx = allData[sheet_name]["headers"].indexOf("生日");
                for(var row in allData[sheet_name]["records"]){
                    if(allData[sheet_name]["records"][row][idx]){
                        allData[sheet_name]["records"][row][idx] = allData[sheet_name]["records"][row][idx].split("/")[1]
                    }
                }
            }
            else{
                babyHistory = resp.response.result[sheet_name];
            }
        }
    }
}
