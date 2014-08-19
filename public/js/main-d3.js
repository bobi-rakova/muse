$(function () {

var n = 40,
    random = d3.random.normal(800, 1000);

function chart(domain, interpolation, tick) {
  var data = [d3.range(n).map(random), d3.range(n).map(random), d3.range(n).map(random), d3.range(n).map(random)];
	
  var margin = {top: 20, right: 0, bottom: 6, left: 80},
      width = 1824 - margin.right,
      height = 800 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain(domain)
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, 1700])
      .range([height, 0]);

  var line = d3.svg.line()
      .interpolate(interpolation)
      .x(function(d, i) { return x(i); })
      .y(function(d) { return y(d); });

  var svg = d3.select("body").append("p").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", margin.left + "px")
      .style("margin-top", margin.top + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var lines = svg.selectAll("g")
      .data(data);

  var aLineContainer = lines
      .enter().append("g"); 

  aLineContainer.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).ticks(5).orient("left"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("microvolts");

  var colors = ["red", "#92278F", "#0071BB", "#00A651"]

  var path = aLineContainer
      .attr("clip-path", "url(#clip)")
    .append("path")
      //.data(data)
      .attr("class", "line")
      .style("stroke", function(d,i) { return colors[i]; })
      .attr("d", line);

  // tick(path, line, data, x);

	var socket = io.connect('http://localhost:3000');
		socket.on('news', function (value) {
			if(!(value.args && value.address == "/muse/eeg"))
				return;

			var xVal = (new Date()).getTime(), // current time
          yVal = value.args[0];

			data[0].push(value.args[0]);
      data[1].push(value.args[1]);
      data[2].push(value.args[2]);
      data[3].push(value.args[3]);

			path
				  .attr("d", line)
				  .attr("transform", null)
				.transition()
				  .duration(750)
				  .ease("linear")
				  .attr("transform", "translate(" + x(0) + ")")

			// pop the old data point off the front
			data[0].shift();
      data[1].shift();
      data[2].shift();
      data[3].shift();
		});
}

chart([1, n - 2], "basis", function tick(path, line, data, x) {});

})
