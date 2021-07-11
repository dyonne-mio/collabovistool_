require('file-loader?name=[name].[ext]!./node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
const Author = require('./models/Author');
const Paper = require('./models/Paper');
const Movie = require('./models/Movie');
const MovieCast = require('./models/MovieCast');
const _ = require('lodash');

const neo4j = require('neo4j-driver');
const neo4jUri = process.env.NEO4J_URI;
const neo4jVersion = process.env.NEO4J_VERSION;
let database = process.env.NEO4J_DATABASE;
//if (!neo4jVersion.startsWith("4")) {
//  database = null;
//}

const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

console.log(`Database running at ${neo4jUri}`)

function searchYear(queryYear) {
	cypher_string = 'MATCH (a1:Author)-[r:COAUTHORED_WITH]->(a2:Author) \
	WHERE r.year <= "' + queryYear + '"\
    RETURN a1.auth_name AS name1, a2.auth_name AS name2, ID(a1) AS id1, ID(a2) AS id2, \
	a1.auth_papers AS paper1, a2.auth_papers AS paper2, \
	a1.degree_centrality AS deg1, a2.degree_centrality AS deg2, \
	a1.betweenness_centrality AS bet1, a2.betweenness_centrality AS bet2, \
	a1.closeness_centrality AS clo1, a2.closeness_centrality AS clo2, \
	a1.eigenvector_centrality AS eig1, a2.eigenvector_centrality AS eig2, \
	a1.louvain_community AS lou1, a2.louvain_community AS lou2, \
	a1.aff_id AS afid1, a2.aff_id AS afid2 \
    LIMIT $limit'
	
	return generateNodesandEdges(cypher_string);
}

function searchAuthors(queryString) {
    cypher_string = 'MATCH (a1:Author)-[r:COAUTHORED_WITH]->(a2:Author) \
	WHERE a1.auth_name CONTAINS "' + queryString + '"\
    RETURN a1.auth_name AS name1, a2.auth_name AS name2, ID(a1) AS id1, ID(a2) AS id2, \
	a1.auth_papers AS paper1, a2.auth_papers AS paper2, \
	a1.degree_centrality AS deg1, a2.degree_centrality AS deg2, \
	a1.betweenness_centrality AS bet1, a2.betweenness_centrality AS bet2, \
	a1.closeness_centrality AS clo1, a2.closeness_centrality AS clo2, \
	a1.eigenvector_centrality AS eig1, a2.eigenvector_centrality AS eig2, \
	a1.louvain_community AS lou1, a2.louvain_community AS lou2, \
	a1.aff_id AS afid1, a2.aff_id AS afid2 \
    LIMIT $limit'
	
	return generateNodesandEdges(cypher_string);
}

function getGraph() {	
	cypher_string = "MATCH (a1:Author)-[r:COAUTHORED_WITH]->(a2:Author) \
    RETURN a1.auth_name AS name1, a2.auth_name AS name2, ID(a1) AS id1, ID(a2) AS id2, \
	a1.auth_papers AS paper1, a2.auth_papers AS paper2, \
	a1.degree_centrality AS deg1, a2.degree_centrality AS deg2, \
	a1.betweenness_centrality AS bet1, a2.betweenness_centrality AS bet2, \
	a1.closeness_centrality AS clo1, a2.closeness_centrality AS clo2, \
	a1.eigenvector_centrality AS eig1, a2.eigenvector_centrality AS eig2, \
	a1.louvain_community AS lou1, a2.louvain_community AS lou2, \
	a1.aff_id AS afid1, a2.aff_id AS afid2 \
    LIMIT $limit"
	
	return generateNodesandEdges(cypher_string);
}

function generateNodesandEdges(cypher_string){
  const session = driver.session({database: database});
  
  return session.readTransaction(tx =>
    tx.run(cypher_string, {limit: neo4j.int(1000)})) // 60 000
	.then(results => {
	  var nodes = [], links = [], names = [];
	  var i = 0;
      results.records.forEach(res => {
		
        if (!names.includes(res.get('name1'))) {
		   //var node1 = Object.create({}, { id: { value: res.get('id1').low, enumerable: true}, name: { value: res.get('name1'), enumerable: true}, label: { value: 'author', enumerable: true} });
		   //nodes.push(node1);
		   nodes.push({id: res.get('id1').low, name: res.get('name1'), label: 'author',
					   p_count: res.get('paper1'), afid: res.get('afid1'),
					   d_cen: res.get('deg1'), b_cen: res.get('bet1'), c_cen: res.get('clo1'), 
					   e_cen: res.get('eig1'), l_com: res.get('lou1')});
		   names.push(res.get('name1'));
		}
		if (!names.includes(res.get('name2'))) {
		   //var node2 = Object.create({}, { id: { value: res.get('id2').low, enumerable: true}, name: { value: res.get('name2'), enumerable: true}, label: { value: 'author', enumerable: true} });
		   //nodes.push(node2);
		   nodes.push({id: res.get('id2').low, name: res.get('name2'), label: 'author',
					   p_count: res.get('paper2'), afid: res.get('afid2'),
					   d_cen: res.get('deg2'), b_cen: res.get('bet2'), c_cen: res.get('clo2'), 
					   e_cen: res.get('eig2'), l_com: res.get('lou2')});
		   names.push(res.get('name2'));
		}
		
		const author1 = {name: res.get('name2'), label: 'author'};
        let target = _.findIndex(nodes, author1);
		if (target === -1){	
			target = i;
			i++;
		}
		
		const author2 = {name: res.get('name1'), label: 'author'};
        let source = _.findIndex(nodes, author2);
		if (source === -1){	
			source = i;
			i++;
		}
		links.push({source, target});		
      });
      return {nodes, links};
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

exports.searchAuthors = searchAuthors;
exports.searchYear = searchYear;
exports.getGraph = getGraph;