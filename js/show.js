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
        myRadarChart="";
    }
}

function showHistory(){
    appendPre(babyHistory["headers"].join());
    var search_type = searchSelect.value;
    var idx_in_history = (search_type == "會員編號") ? babyHistory["headers"].indexOf("會員編號") : babyHistory["headers"].indexOf("內容");
    var cat_idx_in_history = babyHistory["headers"].indexOf("類別");
    chart_data["datasets"][0]["data"] = [0, 0, 0, 0, 0];
    
    for(var row in babyHistory["records"]){
        if(babyHistory["records"][row][idx_in_history].toString().indexOf(searchContent.value.toString()) !== -1){
            appendPre(babyHistory["records"][row].join());

            if(search_type == "會員編號"){
                var cat_idx = CATEGORY.indexOf(babyHistory["records"][row][cat_idx_in_history])
                chart_data["datasets"][0]["data"][cat_idx] += 1;

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

function showResult() {
    if(isEmpty()) return false;
    cleanPre();
    var search_type = searchSelect.value;
    var idx_in_history = babyHistory["headers"].indexOf(search_type);
    
    // find match item in 0-6 sheet
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
    }
    else{}
    showHistory();
}