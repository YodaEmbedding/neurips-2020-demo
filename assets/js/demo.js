var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();

function randomNumberBounds(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function seedData() {
  var now = new Date();
  for (var i = 0; i < MAX_LENGTH; ++i) {
    lineArr.push({
      time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
      kb_transmitted: 0.0,
      ms_inference: 0.0,
      ms_roundtrip: 0.0
    });
  }
}

function updateData() {
  var now = new Date();

  var lineData = {
    time: now,
    kb_transmitted: randomNumberBounds(0, 2.5),
    ms_inference: randomNumberBounds(0, 5),
    ms_roundtrip: randomNumberBounds(0, 10)
  };
  lineArr.push(lineData);

  if (lineArr.length > 30) {
    lineArr.shift();
  }
  d3.select("#chart").datum(lineArr).call(chart);
}

function resize() {
  if (d3.select("#chart svg").empty()) {
    return;
  }
  chart.width(+d3.select("#chart").style("width").replace(/(px)/g, ""));
  d3.select("#chart").call(chart);
}

document.addEventListener("DOMContentLoaded", function() {
  seedData();
  window.setInterval(updateData, 500);
  d3.select("#chart").datum(lineArr).call(chart);
  d3.select(window).on('resize', resize);
});

// Inference time, total inference time, ...
