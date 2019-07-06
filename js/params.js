var CATEGORY = ["裝備", "佈道", "聚會", "事工", "創意學校"];
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
