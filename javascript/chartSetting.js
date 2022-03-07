
/*bar chart */
const barOptions = {
    chart: {
        type: "bar",
        height: "100%",
    },
    fill: {
        type: 'gradient',
    },
    grid: {
        show: false
    },

    colors: ['#ab5e69'],
    plotOptions: {
        bar: {
            horizontal: true
        }
    },

    title: {
        text: "Top 5 events reported",
    },
    series: [],
    noData: {
        text: "loading",
    },
};

/*Line chart */
const options = {
    chart: {
        type: "line",
        height: "100%",
    },
    yaxis: {
        show: false
    },
    fill: {
        type: 'gradient',
    },
    grid: {
        show: false
    },
    dataLabels: {
        enabled: true,
    },
    colors: ['#ab5e69'],
    title: {
        text: "Past 5 year events reported"
    },
    series: [],
    noData: {
        text: "loading",
    },
};
const lineChart = new ApexCharts(document.querySelector("#lineChart"), options);
lineChart.render();

const barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
barChart.render();