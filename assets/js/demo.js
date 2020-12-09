var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();
var split_layer_text = document.getElementById("split_layer");

var curr_dict = {
  kb_transmitted: 0.0,
  ms_inference: 0.0,
  ms_roundtrip: 0.0,
  split_layer: "unknown"
};

var ws;

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
    kb_transmitted: curr_dict["kb_transmitted"],
    ms_inference: curr_dict["ms_inference"],
    ms_roundtrip: curr_dict["ms_roundtrip"]
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

function connectWebsocket() {
  ws = new WebSocket("ws://ensc-mcl-28.engineering.sfu.ca:8765");
  ws.onmessage = (event) => {
    curr_dict = JSON.parse(event.data);
    console.log(curr_dict);
    split_layer_text.textContent = curr_dict["split_layer"];
  };
  // window.setInterval(() => {ms_inference += 1}, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
  seedData();
  window.setInterval(updateData, 500);
  d3.select("#chart").datum(lineArr).call(chart);
  d3.select(window).on('resize', resize);
  connectWebsocket();
});

// Inference time, total inference time, ...
