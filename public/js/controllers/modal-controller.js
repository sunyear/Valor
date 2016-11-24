(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);
    

        ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'items', 'loteService','ESTADOS_LOTES'];
        function ModalInstanceCtrl($scope, $uibModalInstance, items, loteService, ESTADOS_LOTES) {

                var $ctrl = this;

                activate();

                $ctrl.selected = {
                  item: $ctrl.items[0]
                };

                $ctrl.ok = function () {
                  $uibModalInstance.close($ctrl.selected.item);
                };

                $scope.cerrarModal = cerrarModal;

                function cerrarModal(){
                  $ctrl.cancel();
                };

                $ctrl.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };

                $scope.guardarLote = function( id_estado_lote, items ){

                  /*
                  var estado_calidad = 3; //en espera para ser rechazado o aceptado
                  var estado_sijai = 3;// en espera para ser rechazado o aceptado

                  if(lote_estado == 2){
                    estado_calidad = 2
                    estado_sijai = 2;
                  }

                  var registroLote = {
                    'nroLote': items.nro_lote,
                    'n_csv': items.nom_csv,
                    "registros_t": items.registros, //registros totales
                    "registros_r": items.err_tot, //registros rechazados
                    "lote_estado": lote_estado,
                    "lote_causas_r": err_tipo, //causas por las cuales fue rechazado el lote
                    "fecha_lote": items.fecha_lote, //fecha del lote (viene en el nombre del archivo CSV
                    "fecha_proc": '',
                    "id_proc": items.id_proc,
                    "id_estado_proc": items.id_estado_proc
                  };

                  loteService
                    .guardarLote( registroLote )
                    .then( actualizarVista )
                    */

                    //console.log(items)

                    var id_proceso = 100; //PROCESO PREVAL
                    var m = moment(items.fecha_lote);

                    var lote = {
                      nro_lote: items.nro_lote,
                      nro_registros: items.registros,
                      fecha_lote: '20161109',
                      fecha_validado: '20161109',
                      nombre_archivo_csv: items.nom_csv,
                      id_proceso: id_proceso,
                      id_estado_lote: id_estado_lote,
                      estado_lote: ESTADOS_LOTES[id_estado_lote]
                    };

                    //onsole.log(LOTE_ESTADOS[id_lote_estado])
                  
                  
                  loteService
                    .pushLote( lote )
                    .then( actualizarVista );
                  
                  //console.log(moment(1318874398806).unix())
                  $uibModalInstance.close(lote);

                };


                function actualizarVista(registroLote){
                    //console.log(registroLote)
                };

                function activate(){
                  $ctrl.items = items;

                   $ctrl.error = (items.err_fec_const || items.err_fec_venc || items.err_cod_bar || items.err_tol_vel);

                   console.log(items.err_fec_const +'|'+ items.err_fec_venc +'|'+ items.err_cod_bar +'|'+ items.err_tol_vel)

                  if($ctrl.error){
                      $ctrl.msg_validar = 'VALIDACIONES RECHAZADAS';
                  }else{
                      $ctrl.msg_validar = 'VALIDACIONES ACEPTADAS'
                  }

                };

        };//FIN CONTROLLER


})();

