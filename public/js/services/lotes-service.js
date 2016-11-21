(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .factory('loteService', loteService);
    

        loteService.$inject = ['$localForage', '$q', '$http', 'basedatosservice', 'TABLA'];
        function loteService($localForage, $q, $http, basedatosservice, TABLA) {

                //var lotes = ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) || [] );

                var service = {

                    obtenerLotes: obtenerLotes,
                    obtenerLote: obtenerLote,
                    guardarLote: guardarLote,
                    actualizarEstadoLote: actualizarEstadoLote,
                    //metodos auxiliares (se ejecutan una sola vez o manualmente)
                    crearTablaProcesosEstados: crearTablaProcesosEstados,
                    borrarDB: borrarDB,
                    pullLotes: pullLotes,
                    pushLote: pushLote,
                    pullLoteProcesos: pullLoteProcesos

                };

                return ( service );


                //---
                //METODOS PUBLICOS
                //---


                //INICIO METODOS CRUD

                function pullLotes(){
                    var consulta = 'todos';
                    return ( basedatosservice.crudRead( consulta ) );

                };

                function pushLote( lote ){
                    return ( basedatosservice.crudCreate( lote ) );
                };

                function pullLoteProcesos( nro_lote ){
                    var consulta = 'lotes-procesos/vista/' + nro_lote;
                    return ( basedatosservice.crudRead( consulta ) )
                };


                //FIN METODOS CRUD


                function obtenerLotes(  ){

                    return ( basedatosservice.cargarDatosTabla(TABLA.NOMBRE) );

                }

                function obtenerLote( idLote ){
                    var clave = TABLA.NOMBRE + idLote;
                    return ( basedatosservice.obtenerItem( clave ) );
                };

                function guardarLote( lote ) {

                    return $q.when( lote )
                        //.then( buscarLibroEnBiblioteca ) //Si ya existe el registro, no guardar nada.
                        .then( generarIdLote ) //Generar el id que se usara para el registro en la DB
                        .then( prepararRegistro ) //crear el objeto (registro) cuyas propiedades son los campos
                        .then( guardarLoteEnDB ) //guardar directamente en la base de datos (localForage)
                        .then(

                            function guardarDatosExito( id ) {
                                return $q.resolve( id );
                            }

                        ).catch(

                            function Error(error) {
                                console.log('guardarDatos()->error: ' + error)
                            }

                        )

                }


                function actualizarEstadoLote( idLote, id_proceso, estado){
                    obtenerLote( idLote )
                        .then(
                            function procesar( lote ){
                                //console.log(lote)
                                var estado_proc_tmp = [lote.estado_proc[0], estado, lote.estado_proc[2], lote.estado_proc[3]]
                                lote.estado_proc = estado_proc_tmp;
                                //console.log(lote)
                                //guardarLote( lote );
                            }
                        )
                }

                function crearTablaProcesosEstados(){

                    var clave = 'procesos';
                    
                    var registro = {
                        100: 'PREVAL',
                        200: 'CALIDAD',
                        300: 'SIJAI'
                    };

                    return ( basedatosservice.setearItem( clave, registro ) );

                };


                function borrarDB(){
                    return basedatosservice.borrarDB();
                };


                //---
                //METODOS PRIVADOS
                //---

                function generarIdLote( lote ) {

                    var id = (typeof(lote.idLote) == 'number')? lote.idLote : ( new Date() ).getTime();
                    lote.id = id;

                    return ( lote );
                }

                function prepararRegistro( datos ) {

                    //console.log(datos)

                    var registro = {
                        "idLote": datos.id, //idLote,
                        "nroLote": datos.nroLote, //nroLote,
                        "n_csv": datos.n_csv || '', //nombre del archivo CSV    
                        "registros_t": datos.registros_t || 0, //registros totales
                        "registros_r": datos.registros_r || 0, //registros rechazados
                        "lote_estado": datos.lote_estado || 1,
                        "lote_causas_r": datos.lote_causas_r || [], //causas por las cuales fue rechazado el lote
                        "fecha_lote": datos.fecha_lote || 0, //fecha del lote (viene en el nombre del archivo CSV
                        "fecha_proc": fechaHora(), //fecha en que fue procesado el lote
                        "estado_proc": datos.estado_proc || [0,0,0,0] //  //estados que adquire todo el proceso [PREVALIDACION, EN CALIDAD, ACEPTADO SIJAI, RECHAZADO SIJAI]
                    };

                    return ( registro );
                }

                function guardarLoteEnDB( registro ) {

                    var clave = TABLA.NOMBRE + registro.idLote;
                    return ( basedatosservice.setearItem( clave, registro ) );                
                }




                function fechaHora() {
                    var date = new Date();
                    return date.getTime();
                }
        };

})();