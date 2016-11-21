(function(){
  'use strict';

  angular
    .module('lotes.main')
    .service('basedatosservice', basedatosservice);
    

        basedatosservice.$inject = ['$localForage', '$q', '$http'];
        function basedatosservice($localForage, $q, $http) {

                var service = {

                    //metodos localForage
                    cargarDatosTabla: cargarDatosTabla,
                    obtenerItems: obtenerItems,
                    obtenerItem: obtenerItem,
                    obtenerMaxId: obtenerMaxId,
                    setearItem: setearItem,
                    eliminarItem: eliminarItem,
                    borrarDB: borrarDB,
                    //metodos CRUD (CREATE READ UPDATE DELETE)
                    crudRead: crudRead

                };

                return ( service );


                //---
                // METODOS PUBLICOS
                //---
                

                function cargarDatosTabla( tabla ){

                    var datosTabla = [];

                    return $localForage
                        .iterate( 
                            function buscarTabla(value, key, iterationNumber){
                                var tablaDB = key.substr(0,key.lastIndexOf('_')+1);
                                if(tabla == tablaDB){

                                    $q.when( datosTabla.push( value ) );                                
                                }
                                //return datosTabla;
                            } 
                        )
                        .then( 
                            function devolverDatosTabla(data){
                                //console.log(datosTabla)
                                //return( angular.extend( {}, datosTabla ) );
                                return ( $q.when(datosTabla) );
                            }
                        );
                            

                    //return( angular.extend( {}, angular.fromJson( data ) ) );

                }

                function obtenerItems( clave ){

                //console.log(clave)

                var arrDatos = [];
                    var q = $q.defer();

                    $localForage
                    .iterate(
                        function(value, key, iterationNumber) {                        

                            var nombreTablaDB = key.substr(0,key.lastIndexOf('_')+1);
                            //console.log(nombreTablaDB, clave)
                            //if(typeof(clave.test)=='function'){
                                console.log(nombreTablaDB + ':' + clave)
                                if (nombreTablaDB == clave) {

                                    arrDatos.push(value);
                                }
                           // }
                        }
                    ).then(
                        function() {
                            //console.log(arrDatos)
                            q.resolve(arrDatos);
                        }, 
                        function(err) {
                            arrDatos = [];
                            q.reject(err);
                        }
                    );

                    //console.log(q.promise)

                    return ( q.promise );
                }



                function obtenerItem( clave ){

                    //console.log(clave)
                    
                    var defered = $q.defer();
                    var promise = defered.promise;

                    localforage
                    .getItem(clave)
                    .then(
                        function(value) {
                            //console.log(value)
                            defered.resolve(value);
                        }
                    ).catch(
                        function(err) {
                            defered.reject(err);
                        }
                    );

                    return ( promise );
                }

                function obtenerMaxId( params ){

                    var defered = $q.defer(),
                        promise = defered.promise,
                        tabla = params.tabla,
                        id = params.id,
                        regex = new RegExp( tabla + id, "i"),
                        id_base = 1;

                        console.log(params)

                    //var q = $q.defer();
                    $localForage
                        .iterate(
                            function(value, key, iterationNumber) {

                                if (regex.test(key) && (key.indexOf('NaN') == -1 ) ) {

                                    id_base = parseInt( key.substr(key.lastIndexOf('_')+1) ) + 1;
                                   
                                } 
                            
                            }
                        )
                        .then(
                            function exito() {
                                var idRegistro = 'hist_' + id + '_' + id_base;
                                console.log(idRegistro)
                                defered.resolve( idRegistro );
                            }, 
                            function error(error) {
                                defered.reject(error);
                            }//,
                            //function notify(notify){}
                        );

                        return ($q.when( promise ))
                };

                function setearItem( clave, registro ){

                    var defered = $q.defer();
                    var promise = defered.promise;
                    
                    $localForage
                    .setItem(clave, registro)
                        .then(
                            function() {
                                var exito = true;
                                defered.resolve(exito)
                            }, 
                            function(err) {
                                console.log(err);
                                defered.reject(err)
                            }
                        );
                    return ( promise );
                }

                function eliminarItem( clave ){

                    var defered = $q.defer();
                    var promise = defered.promise;

                    $localForage
                        .removeItem( clave )
                        .then(
                            function() {
                                defered.resolve(true)
                            }
                        )
                        .catch(
                            function(err) {

                            }
                        );

                    return ( promise );
                }

                function borrarDB(){

                    return $localForage
                        .clear()
                        .then(
                            function() {

                                return $q.when( true );
                            //obtenerLibrosDeseados();
                        }).catch(function(err) {
                            // This code runs if there were any errors
                            console.log(err);
                        });
                    
                }

                //---
                //METODOS CRUD
                //---

                function crudRead(){

                    var deferred = $q.defer();
                    $http.get('http://localhost:3090/api/todos/')
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(reason) {
                        deferred.reject(reason);
                    });
                    return ( deferred.promise )
                };

        };

})();

