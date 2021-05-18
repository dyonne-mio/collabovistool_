import _ from 'lodash';

import '../css/bootstrap.min.css';
import '../css/all.css';
import '../css/my.css';
import '../js/popper.min.js';
import '../js/jquery-3.3.1.slim.min.js';
import '../js/bootstrap.bundle.min.js';
import '../js/neo4j-web.min.js';
import teamIcon from '../img/team-member.png';
import collaboIcon from '../img/collabo-icon.png';

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
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
  search();

  $("#search-addon").submit(e => {
    e.preventDefault();
    search();
  });
});

$("#search-addon").click(function() {
	console.log("search");
	search();
})

function search() {
  const query = $("#search-addon").find("input[name=search]").val();
  api
    .searchMovies(query)
    .then(movies => {
		var elementID = d3.select('svg').selectAll('.node');	
		//showMovie($(elementID).text());
		
		/*
      const t = $("table#results tbody").empty();

      if (movies) {
        movies.forEach(movie => {
          $("<tr><td class='movie'>" + movie.title + "</td><td>" + movie.released + "</td><td>" + movie.tagline + "</td></tr>").appendTo(t)
            .click(function() {
              showMovie($(this).find("td.movie").text());
            })
        });

        const first = movies[0];
        if (first) {
          showMovie(first.title);
        }
      }*/
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
		.on("click", function(d){
			//var elementID = d3.select(this).attr("class").slice(-1);
			var nodeID = d3.select('svg').selectAll('.node');
			var linkID = d3.select('svg').selectAll('.link');
			
			for (let i = 0; i < nodeID[0].length; i++){
				nodeID[0][i].style.fill = "#FF5349";
				nodeID[0][i].style.strokeWidth = "1.5px";
				nodeID[0][i].style.r = "10";
			}
			
			for (let i = 0; i < linkID[0].length; i++){
				linkID[0][i].style.stroke = "#999";
				linkID[0][i].style.strokeWidth = "1px";
			}
			
			$('#details').text("Name: " + d.name + "\n" +   
			                   "ID: " + d.id + "\n" + 
			                   "Label: " + d.label + "\n" + 
			                   "Weight: " + d.weight + "\n" +  
			                   "Index: " + d.index + "\n\n");

			$('#details').append("CENTRALITIES \n");
			
			$('#details').append("Degree Centrality: " + d.d_cen + "\n" +   
			                   "Betweenness Centrality: " + d.b_cen + "\n" + 
			                   "Closeness Centrality: " + d.c_cen + "\n" + 
			                   "Eigenvector Centrality: " + d.e_cen + "\n\n" +  
			                   "Louvain Community: " + d.l_com);
			
			//var zoom_handler = d3.behavior.zoom().on("zoom", zoom_actions);
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
			  .style("fill", "yellow")
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
		.links(graph.links);
    });
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
