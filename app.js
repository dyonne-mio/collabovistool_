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

function searchAuthors(queryString) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (author:Author) \
      WHERE author.full_name =~ $full_name \
      RETURN author',
      {full_name: '(?i).*' + queryString + '.*'})
    )
    .then(result => {
      return result.records.map(record => {
        return new Author(record.get('author'));
      });
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getAuthor(full_name) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run("MATCH (author:Author {full_name:$full_name}) \
      OPTIONAL MATCH (author)<-[r]-(paper:Paper) \
      RETURN author.full_name AS full_name, \
      collect([paper.paper_title, \
           head(split(toLower(type(r)), '_')), r.abstract]) AS abstract \
      LIMIT 1", {full_name}))
    .then(result => {
      if (_.isEmpty(result.records))
        return null;

      const record = result.records[0];
      return new MovieCast(record.get('full_name'), record.get('abstract'));
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getGraph() {
  const session = driver.session({database: database});
  
  return session.readTransaction(tx =>
    tx.run("MATCH (a1:Author)-[r:COAUTHORED_WITH]->(a2:Author) \
    RETURN a1.auth_name AS name1, a2.auth_name AS name2, ID(a1) AS id1, ID(a2) AS id2, \
	a1.auth_papers AS paper1, a2.auth_papers AS paper2, \
	a1.degree_centrality AS deg1, a2.degree_centrality AS deg2, \
	a1.betweenness_centrality AS bet1, a2.betweenness_centrality AS bet2, \
	a1.closeness_centrality AS clo1, a2.closeness_centrality AS clo2, \
	a1.eigenvector_centrality AS eig1, a2.eigenvector_centrality AS eig2, \
	a1.louvain_community AS lou1, a2.louvain_community AS lou2 \
    LIMIT $limit", {limit: neo4j.int(1000)})) // 60 000
	.then(results => {
	  var nodes = [], links = [], names = [];
	  var i = 0;
      results.records.forEach(res => {
		
        if (!names.includes(res.get('name1'))) {
		   //var node1 = Object.create({}, { id: { value: res.get('id1').low, enumerable: true}, name: { value: res.get('name1'), enumerable: true}, label: { value: 'author', enumerable: true} });
		   //nodes.push(node1);
		   nodes.push({id: res.get('id1').low, name: res.get('name1'), label: 'author',
					   p_count: res.get('paper1'), 
					   d_cen: res.get('deg1'), b_cen: res.get('bet1'), c_cen: res.get('clo1'), 
					   e_cen: res.get('eig1'), l_com: res.get('lou1')});
		   names.push(res.get('name1'));
		}
		if (!names.includes(res.get('name2'))) {
		   //var node2 = Object.create({}, { id: { value: res.get('id2').low, enumerable: true}, name: { value: res.get('name2'), enumerable: true}, label: { value: 'author', enumerable: true} });
		   //nodes.push(node2);
		   nodes.push({id: res.get('id2').low, name: res.get('name2'), label: 'author',
					   p_count: res.get('paper2'), 
					   d_cen: res.get('deg2'), b_cen: res.get('bet2'), c_cen: res.get('clo2'), 
					   e_cen: res.get('eig2'), l_com: res.get('lou2')});
		   names.push(res.get('name2'));
		}
		
		//nodes.push({name: res.get('name1'), label: 'author'});
		//nodes.push({name: res.get('name2'), label: 'author'});
		
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

		//const target = res.get('id2').low;
		//const source = res.get('id1').low;
		
		
		//var connect = {source, target}
		//var connect = Object.create({}, { source: { value: source, enumerable: true}, target: { value: target, enumerable: true} });
		//links.push(connect)
		
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

function searchMovies(queryString) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run('MATCH (movie:Movie) \
      WHERE movie.title =~ $title \
      RETURN movie',
      {title: '(?i).*' + queryString + '.*'})
    )
    .then(result => {
      return result.records.map(record => {
        return new Movie(record.get('movie'));
      });
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getMovie(title) {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
      tx.run("MATCH (movie:Movie {title:$title}) \
      OPTIONAL MATCH (movie)<-[r]-(person:Person) \
      RETURN movie.title AS title, \
      collect([person.name, \
           head(split(toLower(type(r)), '_')), r.roles]) AS cast \
      LIMIT 1", {title}))
    .then(result => {
      if (_.isEmpty(result.records))
        return null;

      const record = result.records[0];
      return new MovieCast(record.get('title'), record.get('cast'));
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

function getMovieGraph() {
  const session = driver.session({database: database});
  return session.readTransaction((tx) =>
    tx.run('MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
    RETURN m.title AS movie, collect(a.name) AS cast \
    LIMIT $limit', {limit: neo4j.int(100)}))
    .then(results => {
      const nodes = [], rels = [];
      let i = 0;
      results.records.forEach(res => {
        nodes.push({title: res.get('movie'), label: 'movie'});
        const target = i;
        i++;

        res.get('cast').forEach(name => {
          const actor = {title: name, label: 'actor'};
          let source = _.findIndex(nodes, actor);
          if (source === -1) {
            nodes.push(actor);
            source = i;
            i++;
          }
          rels.push({source, target})
        })
      });

      return {nodes, links: rels};
    })
    .catch(error => {
      throw error;
    })
    .finally(() => {
      return session.close();
    });
}

exports.searchMovies = searchMovies;
exports.getMovie = getMovie;
exports.getMovieGraph = getMovieGraph;

exports.searchAuthors = searchAuthors;
exports.getAuthor = getAuthor;
exports.getGraph = getGraph;