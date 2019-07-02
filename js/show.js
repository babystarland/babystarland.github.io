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
    if(myRadarChart instanceof Chart){
        myRadarChart.clear();
        myRadarChart.destroy();
    }
}

function showHistory(){
    appendPre(babyHistory["headers"].join());
    var search_type = searchSelect.value;
    var idx = (search_type == "會員編號") ? babyHistory["headers"].indexOf("會員編號") : babyHistory["headers"].indexOf("內容");
    var cat_idx = babyHistory["headers"].indexOf("類別");
    chart_data["datasets"][0]["data"] = [0, 0, 0, 0, 0];
    
    for(var row in babyHistory["records"]){
        if(babyHistory["records"][row][idx].toString().indexOf(searchContent.value.toString()) !== -1){
            appendPre(babyHistory["records"][row].join());

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
}

function getInfoByID(id) {
    var cur = {};
    for(var sheet in allData){
        var idx = allData[sheet]["headers"].indexOf("會員編號");
        for(var row in allData[sheet]["records"]){
            if(allData[sheet]["records"][row][idx] == id){ 
                for(var i = 0; i < allData[sheet]["headers"].length; i++){
                    cur[allData[sheet]["headers"][i]] = allData[sheet]["records"][row][i];
                }
                // TODO: duplicate ID
                return appendPre(JSON.stringify(cur, null, 4));
            }
        }
    }
}

function showResult() {
    if(isEmpty()) return false;
    if(!allData || !babyHistory) setTimeout(showResult, 1000);
    cleanPre();
    var search_type = searchSelect.value;
    var idx_in_history = babyHistory["headers"].indexOf(search_type);
    
    // find match item in 0-6 sheet
    if(searchSelect.value == "會員編號"){
        var info = getInfoByID(searchContent.value);
        appendPre(info);
    }
    showHistory();
}