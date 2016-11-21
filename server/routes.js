/*================================================================
	Server side Routing
	Route Declarations

=================================================================*/

/* ========================================================== 
Internal App Modules/Packages Required
============================================================ */
var todoRoutes = require('./routes/todo-routes.js');	//Exchange routes
var lotes_procesosRoutes = require('./routes/lotes-procesos-routes.js');


module.exports = function(app) {

	/*================================================================
	ROUTES
	=================================================================*/
	app.post('/api/todos', todoRoutes.createTodo);
	app.get('/api/todos', todoRoutes.getTodos);
	//entidad: lotes_procesos
	app.get('/api/lotes-procesos/vista/:nro_lote', lotes_procesosRoutes.getLoteProcesos);
	app.get('/api/lotes-procesos/vista', lotes_procesosRoutes.getTodos);
	app.put('/api/todos/:todo_id', todoRoutes.updateTodo);
	app.delete('/api/todos/:todo_id', todoRoutes.deleteTodo);
};