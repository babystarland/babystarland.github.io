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
        searchTypeDiv.style.display = 'block';
        searchContentDiv.style.display = 'block';
        searchButton.style.display = 'block';
        listMajors();
        callScriptFunction();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
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
function callScriptFunction() {
    var request = {
        'function': 'getHistory',
        'parameters': {"name": "Data"}
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
        // The values of this object are the script's 'errorMessage' 'errorType',
        // and an array of stack trace elements.
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
        // Apps Script function return. 
        console.log(resp.response.result);
        console.log(resp.response.result.headers);
        records = resp.response.result.records;
        headers = resp.response.result.headers;
        if (Object.keys(records).length == 0) {
            appendPre('No records returned!');
        } else {
            // TODO
        }
    }
}
