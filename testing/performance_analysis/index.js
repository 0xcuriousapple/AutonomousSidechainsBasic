window.tfvis = tfvis;
function fill(obj) {
    i = 0;
    let values = [];
    for (let [key, value] of Object.entries(obj)) {
        values[i] = [key, value];
        i++;
    }
    return values;
}
function calculatePercentageIncreaseTPS(obj) {
    x0 = obj[0];
    x1 = obj[1];
    x2 = obj[2];
    x3 = obj[3];
    x4 = obj[4];
    x5 = obj[5];
    return (((x1 - x0) / x0 + (x2 - x1) / x1 + (x3 - x2) / x2 + (x4 - x3) / x3 + (x5 - x4) / x4) / 5 * 100)

}
function draw(obj) {

    const headers = ['Transactions', 'Time (micro-seconds)'];
    let values = fill(obj.m);
    let container = document.getElementById('t1t');
    tfvis.render.table(container, {
        headers,
        values
    });

    values = fill(obj.s1);
    container = document.getElementById('t2t');
    tfvis.render.table(container, {
        headers,
        values
    });
    values = fill(obj.s2);
    container = document.getElementById('t3t');
    tfvis.render.table(container, {
        headers,
        values
    });
    values = fill(obj.s3);
    container = document.getElementById('t4t');
    tfvis.render.table(container, {
        headers,
        values
    });
    values = fill(obj.s4);
    container = document.getElementById('t5t');
    tfvis.render.table(container, {
        headers,
        values
    });
    values = fill(obj.s5);
    container = document.getElementById('t6t');
    tfvis.render.table(container, {
        headers,
        values
    });

    let headers2 = ['No of Sidechains', 'Transactions per second'];
    let temp = {
        "0": parseInt((1000 / parseInt(obj.m["1000"])) * 1000000),
        "1": parseInt((1000 / parseInt(obj.s1["1000"])) * 1000000),
        "2": parseInt((1000 / parseInt(obj.s2["1000"])) * 1000000),
        "3": parseInt((1000 / parseInt(obj.s3["1000"])) * 1000000),
        "4": parseInt((1000 / parseInt(obj.s4["1000"])) * 1000000),
        "5": parseInt((1000 / parseInt(obj.s5["1000"])) * 1000000),
    }
    values = fill(temp);
    container = document.getElementById('tps');
    tfvis.render.table(container, {
        headers: headers2,
        values
    });

    let m;
    m = Array(10).fill(0)
    let i = 0;
    m[i++] = 0;
    for (let [key, value] of Object.entries(obj.m)) {
        m[i] = { "x": key, "y": value };
        i++;
    }
    let s1;
    s1 = Array(10).fill(0)
    i = 0;
    s1[i++] = 0;
    for (let [key, value] of Object.entries(obj.s1)) {
        s1[i] = { "x": key, "y": value };
        i++;
    }
    let s2;
    s2 = Array(10).fill(0)
    i = 0;
    s2[i++] = 0;
    for (let [key, value] of Object.entries(obj.s2)) {
        s2[i] = { "x": key, "y": value };
        i++;
    }
    let s3;
    s3 = Array(10).fill(0)
    i = 0;
    s3[i++] = 0;
    for (let [key, value] of Object.entries(obj.s3)) {
        s3[i] = { "x": key, "y": value };
        i++;
    }
    let s4;
    s4 = Array(10).fill(0)
    i = 0;
    s4[i++] = 0;
    for (let [key, value] of Object.entries(obj.s4)) {
        s4[i] = { "x": key, "y": value };
        i++;
    }
    let s5;
    s5 = Array(10).fill(0)
    i = 0;
    s5[i++] = 0;
    for (let [key, value] of Object.entries(obj.s5)) {
        s5[i] = { "x": key, "y": value };
        i++;
    }
    const series = ['Mainchain', 'Mainchain and 1 Sidechain', 'Mainchain and 2 Sidechains', 'Mainchain and 3 Sidechains', 'Mainchain and 4 Sidechains', 'Mainchain and 5 Sidechains'];
    data = { values: [m, s1, s2, s3, s4, s5], series }


    // Render to page
    container = document.getElementById('linechart-cont');
    tfvis.render.linechart(container, data, { xLabel: "Transactions", yLabel: "Time (ms)", xType: 'quantitative' });

    let x = calculatePercentageIncreaseTPS(temp);
    y = x.toFixed(2);;
    document.getElementById('peri').innerHTML = `<strong>${y}%</strong>`;
}
window.onload = function () {
    var socket = io();
    let data;
    socket.on("data", function (msg) {
        data = msg;
        console.log(data);
        draw(data);
    });
}