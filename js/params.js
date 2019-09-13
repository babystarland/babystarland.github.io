var CATEGORY = ["裝備", "佈道", "聚會", "事工", "創意學校"];
var child_list_header = ["孩子姓名", "會員編號", "小家", "認領老師", "性別", "孩子恩賜", "小朋友就讀學校", "年齡層", "生日"];
var parent_list_header = ["家長(含牧區)", "手機", "家長職業/恩賜", "家長職業類別", "地址"];

var allData = {};
var babyHistory, myRadarChart;
var chart_data = {
    labels: CATEGORY,
    datasets: [
        {
            label: "能力值",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235)",
            pointBackgroundColor: "rgba(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(54, 162, 235)",
            data: [0, 0, 0, 0, 0]
        }
    ]
};
