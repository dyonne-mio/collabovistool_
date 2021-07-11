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

import swal from 'sweetalert2';
window.Swal = swal;

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
  
  // set the dimensions and margins of the graph
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
  width = 900,
  height = 900;
		
  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-6500 -6500 15100 15100")
    .attr("pointer-events", "all");

  api
    .search($("#search-input").val(), this.value, document.getElementById('centrality-dropdown').selectedOptions[0].value)
    .then(graph => {
      createNodesandEdges(height, width, svg, graph);
	      if (document.getElementById("louvain-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { return color(d.l_com); });
		  }
		  else if (document.getElementById("leiden-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { if(d.le_com != null){ return color(d.le_com);} else{ return 'white';} });
		  }
		  else if (document.getElementById("affiliations-tab").classList.contains("active")){
			  var color = d3.scaleOrdinal(d3.schemeCategory10);
			  svg.selectAll("circle").style("fill", function(d) { return color(d.afid); });
		  }
		  else if (document.getElementById("authors-tab").classList.contains("active")) {
			  console.log("THIS IS TRUE")
			  var colorScale = d3.scaleQuantize()
				.range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
				.domain([0,9]);
				
				svg.selectAll("circle").style("fill", function(d) { return colorScale(d.d_cen); });
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
    //swal.fire("Search complete!", "Please see the network below.", "success")
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
		
	var colorScale = d3.scaleQuantize()
    .range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
    .domain([0,9]);
	
	svg.selectAll("circle").style("fill", function(d) { return colorScale(d.d_cen); });
	
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
  $("#louvain-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide(); 
  $("#leiden-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  	 
})

$("#affiliations-tab").click(function() {
	var svg = d3.select("svg");
	
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	svg.selectAll("circle").style("fill", function(d) { return color(d.afid); });
	
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
  $("#louvain-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();
  $("#leiden-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  	 	 
})

$("#louvain-communities-tab").click(function() {
	var svg = d3.select("svg");
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	svg.selectAll("circle").style("fill", function(d) { return color(d.l_com); });
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
  $("#leiden-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  	 	 
})

$("#leiden-communities-tab").click(function() {
	var svg = d3.select("svg");
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	
	svg.selectAll("circle").style("fill", function(d) { if(d.le_com != null){ return color(d.le_com);} else{ return 'white';} });
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
  $("#louvain-communities-tab")
     .removeClass("active")
     // get the nested children and hide
     .find('ul') 
     .hide();  	 	 
})

function search() {
  const query = $("#search-input").val();
  $("#graph").empty();
  
  // set the dimensions and margins of the graph
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
  width = 900,
  height = 900;
		
  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-6500 -6500 15100 15100")
    .attr("pointer-events", "all");
  
  api
    .search(query, slider.value, document.getElementById('centrality-dropdown').selectedOptions[0].value)
    .then(graph => {
      createNodesandEdges(height, width, svg, graph);
	      if (document.getElementById("louvain-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { return color(d.l_com); });
		  }
		  else if (document.getElementById("leiden-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { if(d.le_com != null){ return color(d.le_com);} else{ return 'white';} });
		  }
		  else if (document.getElementById("affiliations-tab").classList.contains("active")){
			  var color = d3.scaleOrdinal(d3.schemeCategory10);
			  svg.selectAll("circle").style("fill", function(d) { return color(d.afid); });
		  }
		  else if (document.getElementById("authors-tab").classList.contains("active")) {
			  console.log("THIS IS TRUE")
			  var colorScale = d3.scaleQuantize()
				.range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
				.domain([0,9]);
				
				svg.selectAll("circle").style("fill", function(d) { return colorScale(d.d_cen); });
		  }
	});

 // if(($('#graph').html() == '')){//svg.contains(document.getElementsByClassName('.nodes')) != null){//
  //  swal.fire("Search complete!", "Please see the network below.", "success")
 // }
 /*if($("svg")[0]){//){
    console.log("present");
    swal.fire("Search complete!", "Please see the network below.", "success");
  } else { 
    console.log("absent");
    Swal.fire({
        icon: 'error',
        title: 'No results found.',
        text: 'Your search did not return any results.'
      })
  }
  */
  
}

function renderGraph() {  	
	// set the dimensions and margins of the graph
var margin = {top: 0, right: 0, bottom: 0, left: 0},
  width = 900,
  height = 900;
		
  const svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
	.attr("display", "block").attr("margin", "auto")
	.attr("viewBox", "-6500 -6500 15100 15100")
    .attr("pointer-events", "all");

  api
    .getGraph(document.getElementById('centrality-dropdown').selectedOptions[0].value)
    .then(graph => {
		createNodesandEdges(height, width, svg, graph);
		
		  if (document.getElementById("louvain-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { return color(d.l_com); });
		  }
		  else if (document.getElementById("leiden-communities-tab").classList.contains("active")){
		  var color = d3.scaleOrdinal(d3.schemeCategory10);
		  svg.selectAll("circle").style("fill", function(d) { if(d.le_com != null){ return color(d.le_com);} else{ return 'white';} });
		  }
		  else if (document.getElementById("affiliations-tab").classList.contains("active")){
			  var color = d3.scaleOrdinal(d3.schemeCategory10);
			  svg.selectAll("circle").style("fill", function(d) { return color(d.afid); });
		  }
		  else if (document.getElementById("authors-tab").classList.contains("active")) {
			  console.log("THIS IS TRUE")
			  var colorScale = d3.scaleQuantize()
				.range(['#f7fcfd','#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'])
				.domain([0,9]);
				
				svg.selectAll("circle").style("fill", function(d) { return colorScale(d.d_cen); });
		  }
    });
}

function createNodesandEdges(height, width, svg, graph){	
	//Object.values(graph)[1].forEach(value => console.log(JSON.stringify(value.target)))

  //simulation.nodes(graph.nodes).links(graph.links).start();
	  
	   // Let's list the force we wanna apply on the network
      var simulation = d3.forceSimulation()                 
	  .force("link", d3.forceLink().distance(200).strength(0.1)                               
      )
      .force("charge", d3.forceManyBody().strength(-400)    // This adds repulsion between nodes. Play with the -400 for the repulsion strength
		  .strength(-1000)
		  .theta(0.9)
		  .distanceMax(4500)
	  )         
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
//      .on("end", ticked);
	  
	   graph.links.forEach(function(d){
//     d.source = d.source_id;    
//     d.target = d.target_id;
  });           

  var link = svg.append("g")
                .style("stroke", "#000")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line");

  var node = svg.append("g")
            .attr("class", "node")
  .selectAll("circle")
            .data(graph.nodes)
  .enter().append("circle")
          .attr("r", 10)
		  .attr("id", d => {
		    return d.name.replace(/\s/g, '').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
		  })
		  .on("mouseover", function(d){
			Hover_Circle(jQuery(this).attr("id"), d.name, d.p_count)
		  })
		  .on("click", function(d){
			//var elementID = d3.select(this).attr("class").slice(-1);
			var nodeID = d3.selectAll('circle');
			var linkID = d3.selectAll('line');
			
			nodeID.style("stroke-width", 1);
			linkID.style("stroke", "#000");
			
			//$('#details').text(String("Name: ").bold());
			$('#details').text(" ")
			$('#details').append(String("Name: ").bold() + d.name + "\n" +   
			                   String("ID: ").bold()  + d.id + "\n" + 
			                   String("Affiliation ID: " ).bold() + d.afid + "\n" + 
			                   String("Paper Count: ").bold() + d.p_count + "\n" +  
			                   String("Index: ").bold() + d.index + "\n");

			$('#details').append("<hr>")
			$('#details').append(String("Degree Centrality: ").bold()  + d.d_cen + "\n" +   
			                   String("Betweenness Centrality: ").bold()  + d.b_cen.toFixed(5) + "\n" + 
			                   String("Closeness Centrality: ").bold() + d.c_cen.toFixed(5) + "\n" + 
			                   String("Eigenvector Centrality: ").bold() + d.e_cen.toFixed(5) + "\n\n" +  
			                   String("Louvain Community ID: ").bold() + d.l_com + "\n\n" + 
			                   String("Leiden Community ID: ").bold() + d.le_com)
							   
		    var current_node = this;
			var largest = null,
			weight = 0;

			var connections = link.filter(function(l) {
			  return l.source.index == d.index || l.target.index == d.index
			});
			d.weight = connections.size();
						
			if (d.weight > weight) {
			  largest = {
				node: this,
				links: connections
			  };
			  weight = d.weight;
			}

		  if (largest) {
			d3.select(largest.node)
			  .style("r", 50)
			  .style("stroke-width", 7);
			
		  largest.links.each(function() {
			  d3.select(this).style("stroke", "red").style("stroke-width", 3);
		  });
		  }
		  })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
  
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("r", 50)
         .style("stroke", "#000")
         .style("stroke-width", "1px")
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
  }
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
    //  simulation.fix(d);
  }

	function dragged(d) {
	  d.fx = d3.event.x
	  d.fy = d3.event.y
	//  simulation.fix(d, d3.event.x, d3.event.y);
	}

	function dragended(d) {
	  d.fx = d3.event.x
	  d.fy = d3.event.y
	  if (!d3.event.active) simulation.alphaTarget(0);
	  //simulation.unfix(d);
	}
  
	//run(graph)
	
	var names = [];
	
		for (i = 0; i < graph.nodes.length; i++) {
		   names.push(graph.nodes[i].name);
		}
		
		autoSearch(document.getElementById('search-input'), names);
  
}

function autoSearch(inp, names){
	/*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < names.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (names[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + names[i].substr(0, val.length) + "</strong>";
          b.innerHTML += names[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + names[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
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

});

$('#centrality-dropdown').on('change', function() {
  $("#graph").empty();
  
  document.getElementById('search-input').value = "";
  slider.value = "2020";
  output.innerHTML = slider.value;
  
  renderGraph();
});

