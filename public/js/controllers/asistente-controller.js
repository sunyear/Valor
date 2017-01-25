(function(){
  'use strict';

  angular
    .module('lotes.lote')
    .controller('AsistenteController', AsistenteController);
    

        AsistenteController.$inject = ['$scope', '$uibModalInstance', 'items', 'loteService','ESTADOS_LOTES'];
        function AsistenteController($scope, $uibModalInstance, items, loteService, ESTADOS_LOTES) {

                var $aCtrl = this;

                activate();


                //---
                //METODOS PRIVADOS
                //-----

                function activate(){
                  return;
                }


                $aCtrl.selected = {
                  //item: $aCtrl.items[0]
                };

                $aCtrl.ok = function () {
                  $uibModalInstance.close($aCtrl.selected.item);
                };

                $scope.cerrarModal = cerrarModal;

                function cerrarModal(){
                  $aCtrl.cancel();
                };

                $aCtrl.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };

               

                    //onsole.log(LOTE_ESTADOS[id_lote_estado])
        };//FIN CONTROLLER


})();

