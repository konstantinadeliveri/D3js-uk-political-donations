// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);

var bleep = new Audio();
bleep.src = "Tiny Button Push.mp3";

var partyCentres = { 
    2016: { x: w / 3, y: h / 3.3}, 
    2017: {x: w / 3, y: h / 2.3} 
  };

var fill = d3.scale.ordinal().range(["#FF0000", "#FFFF00", "#0000CC"]);

var svgCentre = { 
    x: w / 3.6, y: h / 2
  };

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");

function transition(name) {
	if (name === "all-data") {
		sound.play();
		$("#initial-content").fadeIn(250);
		$("#value-scale").fadeIn(1000);
		$("#view-variable-type").fadeOut(250);
		$("#view-year-type").fadeOut(250);
		return total();
		//location.reload();
	}
	if (name === "group-by-year") {
		bleep.play();
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-year-type").fadeIn(1000);
		$("#view-variable-type").fadeOut(250);
		return yearGroup();
	}
if (name === "group-by-grade") {
    bleep.play();
		$("#initial-content").fadeOut(250);
		$("#value-scale").fadeOut(250);
		$("#view-year-type").fadeOut(250);
		$("#view-variable-type").fadeIn(1000);
		return gradeType();
	}
	
}


function start() {

	node = nodeGroup.selectAll("circle")
		.data(nodes)
 .enter().append("circle")
		.attr("class", function(d) { return "node " + d.year; })
		.attr("year", function(d) { return d.year; })
		.attr("class", function(d) { return d.grade; })
.attr("grade", function(d) { return d.grade; })
 .attr("r", 0)
.style("fill", function(d) { return fill(d.year); })

force.gravity(0)
			.friction(0.75)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 1; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(2500)
			.attr("r", function(d) { return d.radius; });
}

function total() {

	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

function yearGroup() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", years)
		.start()
		.colourByParty();
}

function gradeType() {
	force.gravity(0)
		.friction(0.8)
		.charge(function(d) { return -Math.pow(d.radius, 2.0) / 3; })
		.on("tick", grades)
		.start();
}


function years(e) {
	node.each(moveToYears(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function grades(e) {
	node.each(moveToGrades(e.alpha));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function all(e) {
	node.each(moveToCentre(e.alpha))
		.each(collide(0.001));

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}



function moveToGrades(alpha) {
	return function(d) {
		var centreX;
		var centreY;
		if (d.value <= 7){
			centreX = svgCentre.x +70;
			centreY = svgCentre.y -70;
		} else if (d.value > 7 && d.value <= 15 ){
			centreX = svgCentre.x +450;
			centreY = svgCentre.y -70;
		} else if (d.value > 15 && d.value <= 18){
			centreX = svgCentre.x +70;
			centreY = svgCentre.y +250;
		} else {
			centreX = svgCentre.x +500;
			centreY = svgCentre.y +250;
		}
		
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}


function moveToCentre(alpha) {
	return function(d) {
		var centreX = svgCentre.x + 75;
			if (d.value <= 7) {
				centreY = svgCentre.y + 75;
			} else if (d.value > 7 && d.value <= 15) {
				centreY = svgCentre.y + 55;
			} else if (d.value > 15 && d.value <= 18) {
				centreY = svgCentre.y + 35;
			} else  if (d.value > 18 && d.value <= 20 ) {
				centreY = svgCentre.y + 15;
			} else  if (d.value <= maxVal) {
				centreY = svgCentre.y - 5;
			} else {
				centreY = svgCentre.y;
			}

		d.x += (centreX - d.x) * (brake + 0.06) * alpha * 1.2;
		d.y += (centreY - 100 - d.y) * (brake + 0.06) * alpha * 1.2;
	};
}

unction moveToYears(alpha) {
	return function(d) {
		var centreX = partyCentres[d.year].x + 50;
		
			
		
			
			centreY = partyCentres[d.year].y;
		

		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 0.7;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 0.7;
	}
 
}




function moveToYears(alpha) {
	return function(d) {
		var centreY; 
		     var centreX; 
                 if (d.variable === '2017'){	
			centreX = 470;
			centreY = 250;

		} else if(d.variable ==='2016'){
                        centreX = 750;
			                  centreY = 250;

}

		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}


// Collision detection function by m bostock
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    });
  };
}

function display(data) {

	maxVal = d3.max(data, function(d) { return d.amount; });

	var radiusScale = d3.scale.sqrt()
		.domain([0, maxVal])
			.range([10, 20]);

	data.forEach(function(d, i) {
		var y = radiusScale(d.amount);
		var node = {
				radius: radiusScale(d.amount) / 3,
				value: d.amount,
				country: d.country,
				year: d.year,
				yearLabel: d.yearname,
				variable: d.variable,
				gradeLabel: d.gradename,
				color: d.color,
				x: Math.random() * w,
				y: -y
      };
			
      nodes.push(node);
	});

	console.log(nodes);

	force = d3.layout.force()
		.nodes(nodes)
		.size([w, h]);
    
    
    
    
 function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var grade = mosie.attr("grade");
	var year = d.yearLabel;
  var offset = $("svg").offset();

	return start();
}


// image url that want to check
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + country + ".ico";

	
	
	// *******************************************
	
	
	

	

	
	var infoBox = "<p> Country: <b>" + country + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>" 	
	
	 							+ "<p> Year: <b>" + year + "</b></p>"
								+ "<p> Type of Grade: <b>" + grade + "</b></p>"
							
	
	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");
	
	var voice = new SpeechSynthesisUtterance("The donor" + donor + " donated " + amount + "british pounds");
        window.speechSynthesis.speak(voice);

	

	    //Add Picture Bar	
var img = document.createElement("img");
  img.src = imageFile;
  img.setAttribute("height","42");
  img.setAttribute("width","42");
document.getElementById("Pic-bar").appendChild(img);
}


function mouseout() {
	// no more tooltips
		var mosie = d3.select(this);

		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
	
		window.speechSynthesis.cancel();
		}

$(document).ready(function() {
		d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);
    });
    return d3.csv("data/Στατιστικά Πανελληνίων Εξετάσεων 2016-2017.csv", display);

});
