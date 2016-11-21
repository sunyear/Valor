/*================================================================
Server side Routing
Route Definitions

Depending on the REST route/endpoint the PostgreSQL database 
is Queried appropriately.

PostgreSQL DB table name is: 'todos'
=================================================================*/

var pg = require('pg');

var database = require('../config/database.js');
var conString = database.conString;
var results = [];


module.exports = {

	/*================================================================
	CREATE - $http post
	=================================================================*/
	//create todo and send back all todos after creation
	createTodo : function(req, res) {

		results = [];

		//Data to be saved to the DB - taken from $http request packet
		/*
		var data = {
			text : req.body.text,
			done : false
		};
		*/
		
		var data = {
			nro_lote: req.body.nro_lote,
			nro_registros: req.body.nro_registros,
			fecha_lote: req.body.fecha_lote,
			fecha_validado: req.body.fecha_validado,
			nombre_archivo_csv: req.body.nombre_archivo_csv,
			id_proceso: req.body.id_proceso,
			id_estado_lote: req.body.id_estado_lote
		};

  		// get a pg client from the connection pool
  		pg.connect(conString, function(err, client, done) {
   			//client.query("INSERT INTO lotes(text, done) values($1, $2)", [data.text, data.done]);
			
			client.query("INSERT INTO lotes(nro_lote, nro_registros, fecha_lote, fecha_validado, nombre_archivo_csv, id_proceso, id_estado_lote) values($1, $2, $3, $4, $5, $6, $7)", [data.nro_lote, data.nro_registros, data.fecha_lote, data.fecha_validado, data.nombre_archivo_csv, data.id_proceso, data.id_estado_lote]);

			var query = client.query("SELECT * FROM lotes_v ORDER BY nro_lote ASC");

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() { 
				client.end();
				return res.json(results); // return all todos in JSON format  		
			});

			if(err)
				console.log(err);
   		});
    },


	/*================================================================
	READ - $http get
	=================================================================*/
	//Get all todos in the database
	getTodos : function(req, res) {

		results = [];

		// get a pg client from the connection pool
  		pg.connect(conString, function(err, client, done) {
   
			var query = client.query("SELECT * FROM lotes_v ORDER BY nro_lote ASC");

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);

   		});
	},


	/*================================================================
	UPDATE - $http put
	=================================================================*/
	updateTodo : function(req, res) {

		results = [];

  		var id = req.params.todo_id;

		var data = {
			text : req.body.text,
			done: req.body.done
		};

		console.log("ID= "+id); //TEST

		// get a pg client from the connection pool
  		pg.connect(conString, function(err, client, done) {

   			client.query("UPDATE todos SET text=($1), done=($2) WHERE id=($3)", [data.text, data.done, id]);
			var query = client.query("SELECT * FROM todos ORDER BY id ASC");

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);
   		});	        
    },

	/*================================================================
	DELETE - $http delete
	=================================================================*/
	deleteTodo : function(req, res) {

		results = [];
		var id = req.params.todo_id;

		console.log("id= "+id); //TEST

		// get a pg client from the connection pool
  		pg.connect(conString, function(err, client, done) {

   			client.query("DELETE FROM todos WHERE id=($1)", [id]);
   
			var query = client.query("SELECT * FROM todos ORDER by id ASC");

			//can stream row results back 1 at a time
			query.on('row', function(row) {
		      	results.push(row);
			});

			//fired after last row is emitted
			query.on('end', function() { 
			  client.end();
			  return res.json(results); // return all todos in JSON format
			});

			//console.log()
			if(err)
				console.log(err);
   		});	 
	}
};