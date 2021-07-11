import _ from 'lodash';

import '../css/bootstrap.min.css';
import '../css/all.css';
import '../css/my.css';
import '../js/popper.min.js';
import '../js/jquery-3.3.1.slim.min.js';
import '../js/bootstrap.bundle.min.js';
import '../js/neo4j-web.min.js';
//import '../js/d3.min.js';
import teamIcon from '../img/team-member.png';
import collaboIcon from '../img/collabo-icon.png';

const element = document.getElementById('panzoom')
const panzoom = Panzoom(element, {
      // options here
});

// enable mouse wheel
const parent = element.parentElement
parent.addEventListener('wheel', panzoom.zoomWithWheel);


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;

  $("#graph").empty();
  document.getElementById('search-input').value = "";
  
  const width = 800, height = 800;
  const force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-600 -600 2100 2100")
    .attr("pointer-events", "all");

  api
    .searchYear(this.value)
    .then(graph => {
      createNodesandEdges(width, force, svg, graph);
	  
	  if (document.getElementById("communities-tab").classList.contains("active")){
		  var color = d3.scale.category10();
		  svg.selectAll(".node").style("fill", function(d) { return color(d.l_com); });
	  }
	  else if (document.getElementById("affiliations-tab").classList.contains("active")){
		  var color = d3.scale.category10();
		  svg.selectAll(".node").style("fill", function(d) { return color(d.afid); });
	  }
	  else if (document.getElementById("authors-tab").classList.contains("active")) {
		  var colorScale = d3.scale.quantize()
			.range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
			.domain([0,9]);
			
			svg.selectAll(".node").style("fill", function(d) { return colorScale(d.d_cen); });
	  }
	});  
}

var teamImg = document.getElementsByClassName('team');
for (var i = 0; i < teamImg.length; i+= 1) {
    teamImg[i].src = teamIcon;
}

var collaboImg = document.getElementById('collabo-icon');
collaboImg.src = collaboIcon;


const api = require('../app.js');

$(function () {
  renderGraph();

  $("#search-form").submit(e => {
    console.log("searched!");
	e.preventDefault();
    search();
  });
});

var divItems = document.getElementsByClassName("radiodiv");

function selected(item) {
    this.clear();
    item.style.backgroundColor = 'red';
}

function clear() {
    for(var i=0; i < divItems.length; i++) {
        var item = divItems[i];
        item.style.backgroundColor = 'white';
    }
}
$("#authors-tab").click(function() {
	var svg = d3.select("svg");
		
	var colorScale = d3.scale.quantize()
    .range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
    .domain([0,9]);
	
	svg.selectAll(".node").style("fill", function(d) { return colorScale(d.d_cen); });
  $("#affiliations-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $(this)
     .addClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $("#communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  
})

$("#affiliations-tab").click(function() {
	var svg = d3.select("svg");
	
	var color = d3.scale.category20();
	svg.selectAll(".node").style("fill", function(d) { return color(d.afid); });
	
  $("#authors-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $(this)
     .addClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $("#communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();   
})

$("#communities-tab").click(function() {
	var svg = d3.select("svg");
	
	var color = d3.scale.category10();
	svg.selectAll(".node").style("fill", function(d) { return color(d.l_com); });
  $("#affiliations-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $(this)
     .addClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $("#authors-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  
})

function search() {
  const query = $("#search-input").val();
  $("#graph").empty();
  slider.value = "2020";
  output.innerHTML = slider.value;
  
  const width = 800, height = 800;
  const force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-600 -600 2100 2100")
    .attr("pointer-events", "all");

  api
    .searchAuthors(query)
    .then(graph => {
      createNodesandEdges(width, force, svg, graph);
	  
	  if (document.getElementById("communities-tab").classList.contains("active")){
		  var color = d3.scale.category10();
		  svg.selectAll(".node").style("fill", function(d) { return color(d.l_com); });
	  }
	  else if (document.getElementById("affiliations-tab").classList.contains("active")){
		  var color = d3.scale.category10();
		  svg.selectAll(".node").style("fill", function(d) { return color(d.afid); });
	  }
	  else if (document.getElementById("authors-tab").classList.contains("active")) {
		  var colorScale = d3.scale.quantize()
			.range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
			.domain([0,9]);
			
			svg.selectAll(".node").style("fill", function(d) { return colorScale(d.d_cen); });
	  }
	});  
}

function renderGraph() {
  const width = 800, height = 800;
  const force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-600 -600 2100 2100")
    .attr("pointer-events", "all");
  
  api
    .getGraph()
    .then(graph => {
		createNodesandEdges(width, force, svg, graph);
		document.getElementById("authors-tab").click();
    });
}

function createNodesandEdges(width, force, svg, graph){
	console.log(graph)
	//Object.values(graph)[1].forEach(value => console.log(JSON.stringify(value.target)))
		
      force.nodes(graph.nodes).links(graph.links).start();
	  

	  const link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

      const node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
        .attr("class", d => {
          return "node " + d.label
        })
		.attr("id", d => {
		  return d.name.replace(/\s/g, '').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
		})
        .attr("r", 10)
		.attr("fill", "red")
		//.style("fill", function(d) { return color(d.l_com); })
		.on("click", function(d){
			//var elementID = d3.select(this).attr("class").slice(-1);
			var nodeID = d3.select('svg').selectAll('.node');
			var linkID = d3.select('svg').selectAll('.link');
			
			for (let i = 0; i < nodeID[0].length; i++){
				nodeID[0][i].style.strokeWidth = "1.5px";
				nodeID[0][i].style.r = "10";
			}
			
			for (let i = 0; i < linkID[0].length; i++){
				linkID[0][i].style.stroke = "#999";
				linkID[0][i].style.strokeWidth = "1px";
			}
			//$('#details').text(String("Name: ").bold());
      $('#details').text(" ")
			$('#details').append(String("Name: ").bold() + d.name + "\n" +   
			                   String("ID: ").bold()  + d.id + "\n" + 
			                   String("Affiliation ID: " ).bold() + d.afid + "\n" + 
			                   String("Weight: ").bold() + d.weight + "\n" +  
			                   String("Index: ").bold() + d.index + "\n");

			$('#details').append("<hr>")
			$('#details').append(String("Degree Centrality: ").bold()  + d.d_cen + "\n" +   
			                   String("Betweenness Centrality: ").bold()  + d.b_cen.toFixed(5) + "\n" + 
			                   String("Closeness Centrality: ").bold() + d.c_cen.toFixed(5) + "\n" + 
			                   String("Eigenvector Centrality: ").bold() + d.e_cen.toFixed(5) + "\n\n" +  
			                   String("Louvain Community ID: ").bold() + d.l_com);
			
			var zoom_handler = d3.behavior.zoom().on("zoom", zoom_actions);
			//var zoom_handler = d3.zoom().on("zoom", function() { 
            //   svg.attr("transform", d3.event.transform);
           // });
			
			//svg.call(zoom_handler)
			//	.call(zoom_handler.transform, d3.zoomIdentity.translate(0, 0).scale(1));

			var current_node = this;
			var largest = null,
			weight = 0;

			var connections = link.filter(function(l) {
			  return l.source.index == d.index || l.target.index == d.index
			});
			d.weight = connections.length;
			if (d.weight > weight) {
			  largest = {
				node: this,
				links: connections
			  };
			  weight = d.weight;
			}

		  if (largest) {
			d3.select(largest.node)
			  .style("stroke-width", 3)
			  .style('r', "15");
			largest.links.each(function() {
			  d3.select(this).style("stroke", "red").style("stroke-width", 3);
			});
			var scaleZoom = 2;
			var nodeDatum = d3.select(largest.node).datum();
			
			svg.transition()
			   .duration(750)
			   .call(zoom_handler.transform,
					 d3.zoomIdentity
					   .translate(width*0.5-scaleZoom*nodeDatum.x,
								  height*0.5-scaleZoom*nodeDatum.y)
					   .scale(scaleZoom));
		  }
		  //Click_Circle(jQuery(this).attr("id"));
		})
		.on("mouseover", function(d){
			Hover_Circle(jQuery(this).attr("id"), d.name, d.p_count)
		})
        .call(force.drag);

      // force feed algo ticks
      force.on("tick", () => {
        link.attr("x1", d => {
          return d.source.x;
        }).attr("y1", d => {
          return d.source.y;
        }).attr("x2", d => {
          return d.target.x;
        }).attr("y2", d => {
          return d.target.y;
        });

        node.attr("cx", d => {
          return d.x;
        }).attr("cy", d => {
          return d.y;
        });
      });
	  /*
	  var simulation = d3.forceSimulation(node)
		.force("link", d3.forceLink().distance(300).id(function(d) {
		  return d.id;
		}))
		.force("charge", d3.forceManyBody().strength(-300))
		.force("center", d3.forceCenter(width / 2, height / 2));

	  simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	  simulation.force("link")
		.links(graph.links);*/
}

function zoom_actions() {
  svg.attr("transform", d3.event.transform);
}

function Click_Circle(id){		
	$('#' + id).css("fill", "yellow");
	$('#' + id).attr('r', function() {
		return 15;
	  });
}

function Hover_Circle(id, name, weight){
	$('#' + id).popover({trigger:'hover', placement:'bottom', title:name, content:"paper count: " + weight});
	 //test();//your function getting called on click of circle. 
}

$(function () {
d3.selectAll("circle")
      .on("mouseover", function(){
          d3.select(this)
            .style("background-color", "orange");

          // Get current event info
          console.log(d3.event);
          
          // Get x & y co-ordinates
          console.log(d3.mouse(this));
      })
      .on("mouseout", function(){
          d3.select(this)
            .style("background-color", "steelblue")
      });
});
