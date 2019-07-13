function isEmpty() {
    if(searchContent.value.trim() === "") return true;
}

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
    try {
        if(myRadarChart instanceof Chart){
            myRadarChart.clear();
            myRadarChart.destroy();
        }
      }
    catch(err) {
        console.log(err);
    }
    $('#list_table').bootstrapTable('destroy');
}

function showHistory(){
    // appendPre(babyHistory["headers"].join());
    var cur = [];
    var search_type = searchSelect.value;
    var idx = (search_type == "會員編號") ? babyHistory["headers"].indexOf("會員編號") : babyHistory["headers"].indexOf("內容");
    var cat_idx = babyHistory["headers"].indexOf("類別");
    chart_data["datasets"][0]["data"] = [0, 0, 0, 0, 0];
    
    for(var row in babyHistory["records"]){
        if(babyHistory["records"][row][idx].toString().indexOf(searchContent.value.toString()) !== -1){
            cur.push(babyHistory["records"][row]);
            // appendPre(babyHistory["records"][row].join());
            // show chart
            if(search_type == "會員編號"){
                var data_idx = CATEGORY.indexOf(babyHistory["records"][row][cat_idx])
                chart_data["datasets"][0]["data"][data_idx] += 1;

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
    }
    return cur;
}

function getInfoByID(id) {
    var cur = {};
    for(var sheet in allData){
        var idx = allData[sheet]["headers"].indexOf("會員編號");
        for(var row in allData[sheet]["records"]){
            if(allData[sheet]["records"][row][idx] == id){ 
                for(let i = 0; i < allData[sheet]["headers"].length; i++){
                    cur[allData[sheet]["headers"][i]] = allData[sheet]["records"][row][i];
                }
                // TODO: duplicate ID
                return JSON.stringify(cur, null, 4);
            }
        }
    }
}

function showResult() {
    if(isEmpty()) return false;
    if(!babyHistory && gapi.auth2.getAuthInstance().isSignedIn.get()){
        appendPre("loading");
        return setTimeout(showResult, 1000);
    }
    cleanPre();
        
    // find match person from all name lists
    if(searchSelect.value == "會員編號" && parseInt(searchContent.value)){
        var info = getInfoByID(searchContent.value);
        appendPre(info);
    }
    else{}
    var history = showHistory();
    showTable(babyHistory["headers"], history)
}

function showTable(header, data) {
    var col = [];
    for(var i in header){
        var tmp = {
            "title": header[i]
        }
        col.push(tmp);
    }

    $('#list_table').bootstrapTable('destroy');
    $('#list_table').bootstrapTable({
        "columns": col,
        "data": data,
        "search": true,
        //"searchOnEnterKey": true
    });
}

function getListData(header){
    var data_list = [];
    for(var sheet in allData){
        var idx_list = [];
        for (let i = 0; i < header.length; i++) {
            idx_list.push(allData[sheet]["headers"].indexOf(header[i]));
        }
        
        for(var row in allData[sheet]["records"]){
            if (allData[sheet]["records"][row][idx_list[0]] == "") {
                continue;
            }
            var cur = [];
            for (let j = 0; j < idx_list.length; j++) {
                if (allData[sheet]["records"][row][idx_list[j]] != "" && !Number.isInteger(allData[sheet]["records"][row][idx_list[j]])) {
                    cur.push(allData[sheet]["records"][row][idx_list[j]].replace("\n", "<br>"));
                }
                else{
                    cur.push(allData[sheet]["records"][row][idx_list[j]]);
                }
            }
            data_list.push(cur);
        }
    }
    return data_list;
}
function showList(header){
    if(Object.keys(allData).length === 0 && gapi.auth2.getAuthInstance().isSignedIn.get()){
        appendPre("loading");
        return setTimeout(function(){
            showList(header);
        }, 1000);
    }
    cleanPre();
    var data = getListData(header);
    showTable(header, data);
}