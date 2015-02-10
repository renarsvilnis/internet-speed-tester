/*
Written by Renārs Vilnis

Inspiration and code fragments for charts taken from:

# basic barcharts
http://bl.ocks.org/mbostock/3943967
http://bl.ocks.org/mbostock/3886208
http://strongriley.github.io/d3/ex/stack.html

# long labels
http://bl.ocks.org/mbostock/7555321

# points line
http://bl.ocks.org/mbostock/3970883

# irregular histogram
http://bl.ocks.org/mbostock/1624660
http://bl.ocks.org/mbostock/1624656

# hierarchical bar chart
http://bl.ocks.org/mbostock/1283663

# stacked bar chart
http://bl.ocks.org/mbostock/1134768

*/

var Log = function(input) {
  this.data = input;
  this.dayData = this._group(this.data, true);
  this.hourData = this._group(this.data, false);
};

Log.prototype._group = function(data, groupByHour) {
  // group either by hour or day
  var timeFnc = groupByHour ? 'getHours' : 'getDay';

  var grouped = {};


  for(var timestamp in data) {
    var date = new Date(timestamp * 1);
    var sortValue = date[timeFnc]();

    if(!grouped[sortValue])
      grouped[sortValue] = {};

    grouped[sortValue][timestamp] = data[timestamp];
  }

  return grouped;
};

Log.prototype._getKeyStats = function(jsonKey, data) {
  // jsonKey is a key path to the log object desired value
  // returns lowest, average, highest value of desired key

  if(!data)
    data = this.data;

  var min,
      avg = 0,
      max;

  var logCount = Object.keys(data).length;

  for(var timestamp in data) {
    var obj = data[timestamp],
        value = Bro(obj).iCanHaz(jsonKey);

    // compare min
    if(typeof min == 'undefined') {
      min = value;
    } else if(value < min) {
      min = value;
    }

    avg += value;

    // compare max
    if(typeof max == 'undefined') {
      max = value;
    } else if(value > max) {
      max = value;
    }

  }

  avg /= logCount;

  return {
    min: min,
    avg: avg,
    max: max
  };
};

// summarize stats and displays them
Log.prototype.summarize = function() {
  var upload = this._getKeyStats('speeds.upload');
  var download = this._getKeyStats('speeds.download');
  var ping = this._getKeyStats('server.ping');


  console.log(upload, download, ping);
};

Log.prepairData = function(input) {

  // build zerro value aray
  var out = d3.range(n).map(function() {
    return d3.range(m).map(function(i) {
      return {
        x: i,
        y: 0
      };
    });
  });

  for(var hour in input) {
    var hourLog = input[hour];

    var avgUp   = 0,
        avgDown = 0,
        avgPing = 0;

    var logCount = Object.keys(hourLog).length;

    for(var epoch in hourLog) {
      var log = hourLog[epoch];
      avgUp += log.speeds.upload;
      avgDown += log.speeds.download;
      avgPing += log.server.ping;
    }

    avgUp /= logCount;
    avgDown /= logCount;
    avgPing /= logCount;

    out[0][hour].y = avgUp;
    out[1][hour].y = avgDown;
    out[2][hour].y = avgPing;
  }

  return out;
};


var log = new Log(dataJSON);
log.summarize();

// -----
// Start to draw diagram

var n = 3, // number of layers
    m = 24, // number of samples per layer
    stack = d3.layout.stack(),

    days = [
     'Monday',
     'Tuesday',
     'Wednesday',
     'Thursday',
     'Friday',
     'Saturday',
     'Sunday'
    ],

    layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); })),
    // layers = stack(Log.prepairData(groupedData)),

    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

var margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], 0.08); // 0.08 = bar width 92%

var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);

var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#aad", "#556"]);
    // .range(["#F00", "#00F"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  for (i = 0; i < 5; ++i) bump(a);

  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}