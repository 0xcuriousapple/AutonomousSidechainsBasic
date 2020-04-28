window.tfvis = tfvis;
function draw(data) {
    console.log(data);
    let series1;
    series1 = Array(10).fill(0)
    let i = 0;
    for (let [key, value] of Object.entries(data)) {
        series1[i] = { "x": key, "y": value };
        i++;
    }
    // const series1 = Array(100).fill(0)
    //     .map(y => Math.random() * 100 - (Math.random() * 50))
    //     .map((y, x) => ({ x, y, }));
    console.log(series1);


    console.log(series1);
    const series = ['Mainchain'];
    data = { values: [series1], series }

    // Render to visor
    const surface = tfvis.visor().surface({ name: 'Linechart', tab: 'Charts' });
    tfvis.render.linechart(surface, data, { xAxisDomain: [0, 1000], xLabel: "Transactions", yLabel: "Time (ms)", xType: 'quantitative' });


    // Render to page
    const container = document.getElementById('linechart-cont');
    tfvis.render.linechart(container, data, { xLabel: "Transactions", yLabel: "Time (ms)", xType: 'quantitative' });

}
window.onload = function () {
    //var socket = io();
    let data;
    socket.on("data", function (msg) {
        data = msg;
        console.log(data);
        draw(data);
    });
}