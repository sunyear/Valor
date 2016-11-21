(function(){
	'use strict';

	angular
		.module('lotes.lote')
		.controller('LoteController', LoteController);
		

        LoteController.$inject = ['$scope', '$state', 'moment', '$filter', '$uibModal', '$log', '$document', 'loteService'];
        function LoteController($scope, $state, moment, $filter, $uibModal, $log, $document, loteService) {

                var vm = this;

                var $ctrl = vm;

                vm.mostrar_resultados = false;

                vm.isOpen = false;

                vm.nro_lote_tmp;




                vm.exito = true;
                vm.info, vm.fecha_lote, vm.fecha_const_calc, vm.fecha_venc_calc;

                vm.nro_lote = 0;

                vm.CSVContent, vm.CSVFilename =  '';


                vm.registrosTotales, vm.registrosErrores = 0;


                vm.momento = '';

                vm.reg_actual = '';

                vm.btnProcesarDisabled = true;

                vm.cant_err_fec_const = 0;
                vm.cant_err_fec_venc = 0;
                vm.cant_err_cod_bar = 0;
                vm.cant_err_tol_vel = 0;
                vm.err_fec_const = false; 
                vm.err_fec_venc = false;
                vm.err_cod_bar = false;
                vm.err_tol_vel = false;

                vm.err_fec_venc_arr = [];
                vm.err_fec_const_arr = [];
                vm.err_cod_bar_arr = [];
                vm.err_vel_tol_arr = [];


                vm.reg_fallo = [];


                //CAMPOS DEL CSV Y SUS POSICIONES
                var POS_FEC_CONST = 27, // FECHA CONSTATACION
                    POS_FEC_VENC = 6,   //FECHA VENCIMIENTO
                    POS_VEL_BASE = 29,  //VELOCIDAD BASE
                    POS_VEL_REG = 30,   //VELOCIDAD REGISTRADA
                    POS_COD_BARRAS = 18; //CODIGO DE BARRAS
                        
                var aFile, 
                    aRegistro = [];

                var objPrev,
                    objVal = {};

                var id_acta,
                    fec_const, 
                    fec_venc, 
                    vel_base,
                    vel_reg,
                    cod_barras = '';



                vm.estados = {1:'APROBADO',2:'RECHAZADO', 3:'APROBADO CON ERRORES'};
                vm.validaciones = {1:'Fecha constatacion', 2:'Fecha vencimiento', 3:'Codigo barras', 4:'Tolerancia Vel.Max'}

                vm.arr_hist = [];

                $scope.arr_hist = vm.arr_hist;


                $scope.today = function() {
                    $scope.dt = new Date();
                    calcularFechas();
                  };


                $scope.today();
                $scope.fec_const_calc = {};

                angular.copy($scope.dt, $scope.fec_const_calc);

                activate();
                

                //API PUBLICA

                vm.procesarLote = procesarLote;
                vm.calcularFechas = calcularFechas;
                $scope.leerCSV = leerCSV;
                vm.actualizarEstadoProceso = actualizarEstadoProceso;
                vm.informarEstadoProceso = informarEstadoProceso;
                vm.obtenerLote = obtenerLote
                //metodos auxiliares
                vm.borrarDB = borrarDB;
                vm.crearTablaProcesosEstados = crearTablaProcesosEstados;
                //fin metodos auxiliares

                //METODOS PUBLICOS


                vm.open = function (size, parentSelector) {

                        var parentElem = parentSelector ? 
                        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                        var modalInstance = $uibModal.open({
                                animation: true,
                                ariaLabelledBy: 'modal-title',
                                ariaDescribedBy: 'modal-body',
                                templateUrl: './views/modal-template.html',
                                controller: 'ModalInstanceCtrl',
                                controllerAs: '$ctrl',
                                size: size,
                                appendTo: parentElem,
                                resolve: {
                                        items: function () {


                                                var obj = {
                                                        //propiedades generales
                                                        'fec_const_calc': vm.fec_const_calc,
                                                        'fecha_venc_calc': vm.fecha_venc_calc,
                                                        //fecha imposicion
                                                        'err_fec_const': vm.err_fec_const,
                                                        'cant_err_fec_const': vm.cant_err_fec_const,
                                                        'porc_err_fec_const': vm.porc_err_fec_const,
                                                        'arr_const': vm.err_fec_const_arr,
                                                        //fecha vencimiento
                                                        'err_fec_venc': vm.err_fec_venc,
                                                        'cant_err_fec_venc': vm.cant_err_fec_venc,
                                                        'porc_err_fec_venc': vm.porc_err_fec_venc,
                                                        'arr_venc': vm.err_fec_venc_arr,
                                                        //codigo barras
                                                        'err_cod_bar': vm.err_cod_bar,
                                                        'cant_err_cod_bar': vm.cant_err_cod_bar,
                                                        'porc_err_cod_bar': vm.porc_err_cod_bar,
                                                        'arr_cod_bar': vm.err_cod_bar_arr,
                                                        //tolerancia velocidad
                                                        'err_tol_vel': vm.err_tol_vel,
                                                        'cant_err_tol_vel': vm.cant_err_tol_vel,
                                                        'porc_err_tol_vel': vm.porc_err_tol_vel,
                                                        'arr_tol_vel': vm.err_tol_vel_arr,
                                                        //
                                                        'nro_lote': vm.nro_lote,
                                                        'nom_csv': vm.CSVFilename,
                                                        'fecha_lote': $scope.dt,
                                                        'registros': vm.registrosTotales,
                                                        'err_tot': vm.cant_err_tol_vel + vm.cant_err_fec_venc + vm.cant_err_fec_const + vm.cant_err_cod_bar,
                                                        'fecha_proc': new Date()
                                                }

                                                return ( obj );
                                        }
                                }
                        });

                        modalInstance.result.then(function (selectedItem) {
                                vm.selected = selectedItem;
                                console.log(selectedItem)
                                vm.arr_hist.push(selectedItem)
                        }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                        });
                };



                function leerCSV( contents ){

                        vm.CSVFilename = contents[0];
                        vm.CSVContent = contents[1];

                        var tmp = vm.CSVFilename.split('_');
                        vm.nro_lote = parseInt(tmp[1]);

                        var aFile = vm.CSVContent.split('\n');
                        vm.registrosTotales = (aFile.length) -1;
                        aFile = '';//dummy

                        vm.btnProcesarDisabled = false;
                        return ( vm.CSVContent );
                };

                function procesarLote(){

                        var cRegistros = 10;
                        
                        //Genero un array; cada elemento corresponde a un registro del archivo CSV
                        aFile = vm.CSVContent.split('\n');
                        cRegistros = (aFile.length) -1;
                        vm.registrosTotales = cRegistros;
                        for(var i=0; i<cRegistros; i++){
                                vm.exito = validarRegistro(aFile[i]);
                        };


                        var arr = {
                                'err_tol_vel':vm.cant_err_tol_vel,
                                'err_fec_venc': vm.cant_err_fec_venc,
                                'err_fec_const': vm.cant_err_fec_const,
                                'cant_err_cod_bar': vm.cant_err_cod_bar
                        }

                        //console.log(arr);

                        var cant_err = vm.cant_err_tol_vel + vm.cant_err_fec_venc + vm.cant_err_fec_const + vm.cant_err_cod_bar;

                        if(cant_err > 0){
                                procesarErrores();
                        }

                        vm.mostrar_resultados = true;

                        vm.open();


                };

                function calcularFechas(){

                        vm.fecha_lote = new Date($scope.dt)

                        vm.fecha_const_calc = moment(vm.fecha_lote).subtract(60, 'days').toDate();
                        vm.fecha_venc_calc = moment(vm.fecha_lote).add(45, 'days').toDate();

                }

                function borrarDB(){
                        loteService.borrarDB();
                };

                function crearTablaProcesosEstados(){
                        loteService
                                .crearTablaProcesosEstados()

                };

                function actualizarEstadoProceso( idLote, id_proceso, estado ){
                        loteService
                                .actualizarEstadoLote( idLote, id_proceso, estado )
                                .then(
                                        function procesarResultados( result ){
                                                console.log(result);
                                        }
                                )
                };


                function obtenerLote( nro_lote ){

                    vm.isOpen !== vm.isOpen;

                    //console.log()

                    //if(vm.isOpen && (typeof(vm.lote_procesos) == 'undefined' || typeof(vm.lote_procesos) == null) ){
                    if(vm.nro_lote_tmp != nro_lote){
                        loteService
                            .pullLoteProcesos( nro_lote )
                            .then( publicarLoteProcesos );
                        vm.nro_lote_tmp = nro_lote;
                    }
                    
                };


                $scope.alerts = [
                    //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
                    //{ type: 'success', msg: 'Well done! You successfully read this important alert message.' },
                    //{ type: 'info', msg: 'asdasdasd'}
                  ];

                  $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                  };


                
                  

                  $scope.clear = function() {
                    $scope.dt = null;
                  };

                  $scope.inlineOptions = {
                    customClass: getDayClass,
                    minDate: new Date(),
                    showWeeks: true
                  };

                  $scope.dateOptions = {
                    dateDisabled: disabled,
                    formatYear: 'yyyy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                  };

                  // Disable weekend selection
                  function disabled(data) {
                    var date = data.date,
                      mode = data.mode;
                    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                  }

                  $scope.open2 = function() {
                    $scope.popup2.opened = true;
                  };

                  $scope.setDate = function(year, month, day) {

                    $scope.dt = new Date(year, month, day);

                    //angular.copy($scope.dt, $scope.fec_const_calc);

                    //vm.fecha_lote = $scope.dt;

                    ///////////

                    //calcularFechaConstatacion();

                  };

                  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                  $scope.format = $scope.formats[1];
                  $scope.altInputFormats = ['M!/d!/yyyy'];

                  $scope.popup1 = {
                    opened: false
                  };

                  $scope.popup2 = {
                    opened: false
                  };

                  var tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  var afterTomorrow = new Date();
                  afterTomorrow.setDate(tomorrow.getDate() + 1);
                  $scope.events = [
                    {
                      date: tomorrow,
                      status: 'full'
                    },
                    {
                      date: afterTomorrow,
                      status: 'partially'
                    }
                  ];

                  function getDayClass(data) {
                    var date = data.date,
                      mode = data.mode;
                    if (mode === 'day') {
                      var dayToCheck = new Date(date).setHours(0,0,0,0);

                      for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                          return $scope.events[i].status;
                        }
                      }
                    }

                    return '';
                  }

                //---
                //METODOS PRIVADOS
                //---

                function validarRegistro( registro ){

                        aRegistro = registro.split(';');

                        var id_acta = aRegistro[0];
                        fec_venc = aRegistro[POS_FEC_VENC];
                        fec_const = aRegistro[POS_FEC_CONST];
                        vel_base = aRegistro[POS_VEL_BASE];
                        vel_reg = aRegistro[POS_VEL_REG];
                        cod_barras = aRegistro[POS_COD_BARRAS];

                        vm.reg_actual = id_acta;

                        //console.log(vm.reg_actual)



                        vm.exito = validarFechaConstatacion( fec_const );

                        //if(vm.exito){
                                vm.exito = validarFechaVencimiento( fec_venc );
                        //}

                        //if(vm.exito){
                                vm.exito = validarToleranciaVelocidad( vel_base, vel_reg );
                        //}

                        //if(vm.exito){
                                vm.exito = validarCodBarras( cod_barras, fec_venc );
                        //}

                        return ( vm.exito );
                };

                //---
                //fec_const: fecha de imposicion del correo (dia en que fueron procesadas por el Correo Argentino)
                //
                //REGLA DE NEGOCIO: FECHA CONSTATACION (fecha informada en el CSV) > FECHA CALCULADA ( (fecha del lote + 5 dias habiles) - 60 dias)  
                //---
                function validarFechaConstatacion( fec_const ){

                        var fec_const_valida = false;
                        //vm.info = $filter('date')(fec_const, 'yyyy-MM-dd');;

                        //Creo un "momento" a partir de la fecha de constatacion (VIENE DEL CSV)
                        var m_fec_const = moment(fec_const, 'YYYYMMDD');
                        //var fecha_calculada = moment(vm.fecha_lote, 'YYYYMMDD').subtract(60, 'days').toDate();
                        //isAfter() -> devuelve TRUE si m_fec_const > vm.proc
                        fec_const_valida = m_fec_const.isAfter(vm.fecha_const_calc);

                        if(!fec_const_valida){
                                var reg = {
                                        'nroActa': vm.reg_actual,
                                        'fec_const': m_fec_const
                                }
                                vm.err_fec_const_arr.push(reg);
                                vm.cant_err_fec_const++;
                        }

                        return ( fec_const_valida );
                };


                //---
                //fec_venc: fecha de vencimiento
                //
                //REGLA DE NEGOCIO: FECHA VENCIMIENTO (fecha informada en el CSV) > FECHA CALCULADA ( (fecha del lote + 1 dias habil) + 45 dias) 
                //---
                function validarFechaVencimiento( fec_venc ){

                        var fec_venc_valida = false;
                        var m_fec_venc, fecha_calculada = '';

                        m_fec_venc = moment(fec_venc, 'YYYYMMDD');

                        fec_venc_valida = m_fec_venc.isAfter(vm.fecha_venc_calc);

                        if(!fec_venc_valida){

                                var reg = {
                                        'nroActa': vm.reg_actual,
                                        'fec_venc': m_fec_venc,
                                }
                                vm.err_fec_venc_arr.push(reg);
                                vm.cant_err_fec_venc++
                        }

                        return ( fec_venc_valida );
                }


                //---
                //vel_base: limite de velocidad; vel_reg: velocidad registrada
                //
                //REGLA DE NEGOCIO: CRITERIOS DE TOLERANCIA SEGUN RATIFICAION DE LA AGENCIA PROVINCIAL DE SEGURIDAD VIAL
                //---
                function validarToleranciaVelocidad( vel_base, vel_reg  ){

                        var exito = true;

                        var index = vel_base * 1; //parsear a INT

                        var vel_reg_cmp = parseFloat(vel_reg);

                        //console.log(vel_base * 1)

                        var objVelocidadesTolerancia = {
                                130:134,
                                120:124,
                                110: 114,
                                100:103,
                                90:95,
                                80:85,
                                70:74,
                                60:67
                        };

                        var tolerancia = objVelocidadesTolerancia[index];
                        //console.log(vel_reg.valueOf())

                        exito = !(vel_reg_cmp <= tolerancia);

                        if(!exito){
                                var reg = {
                                        'nroActa': vm.reg_actual,
                                        'vel_reg': vel_reg,
                                        'vel_base': vel_base
                                }
                                vm.err_vel_tol_arr.push(reg);
                                vm.cant_err_tol_vel++;
                        }

                        return ( exito );

                };


                //---
                //cod_barras: el codigo de barras; fec_venc: fecha de vencimiento
                //
                //REGLA DE NEGOCIO: SE VALIDA QUE LA FECHA DE VENCIMIENTO ESTE INCLUIDA EN EL CODIGO DE BARRAS
                //---
                function validarCodBarras( cod_barras, fec_venc ){

                        var encontrado = true;

                        encontrado = (cod_barras.indexOf(fec_venc) != -1)?true:false;
                        //console.log(cod_barras, fec_venc)

                        if(!encontrado){
                                var reg = {
                                        'nroActa': vm.reg_actual,
                                        'cod_barras': cod_barras,
                                        'fec_venc': fec_venc
                                }
                                vm.err_cod_bar_arr.push(reg);
                                vm.cant_err_cod_bar++;
                        }

                        return ( encontrado );

                };


                //----
                //
                // FECHA CONSTATACION: 1% tolerancia error -> porc_err_fec_const
                // FECHA VENCIMIENTO: tolerancia 0 -> porc_err_fec_venc
                // FECHA VENCIMIENTO (en codigo barras): tolerancia 0 -> porc_err_cod_bar
                // TOLERANCIA VELOCIDAD: 1% de tolerancia -> porc_err_tol_vel
                //
                //----
                function procesarErrores(){

                        var porc_err_fec_venc = (vm.cant_err_fec_venc * 100 / vm.registrosTotales);
                        var porc_err_fec_const = (vm.cant_err_fec_const * 100 / vm.registrosTotales);
                        var porc_err_cod_bar = (vm.cant_err_cod_bar * 100 / vm.registrosTotales);
                        var porc_err_tol_vel = (vm.cant_err_tol_vel * 100 / vm.registrosTotales);


                        vm.porc_err_fec_venc = porc_err_fec_venc.toPrecision(3);
                        vm.porc_err_fec_const = porc_err_fec_const.toPrecision(3);
                        vm.porc_err_cod_bar = porc_err_cod_bar.toPrecision(3);
                        vm.porc_err_tol_vel = porc_err_tol_vel.toPrecision(3);


                        if(porc_err_fec_venc > 0){
                                vm.err_fec_venc = true;
                        }

                        if(porc_err_tol_vel > 1){
                                vm.err_tol_vel = true;
                        }

                        if(porc_err_cod_bar > 0){
                                vm.err_cod_bar = true;
                        }

                        if(porc_err_fec_const > 1){
                                vm.err_fec_const = true;
                        }


                };


                function activate(){
                        /*
                        loteService
                                .obtenerLotes()
                                .then( publicarLotes );
                        */                        

                        loteService
                                .pullLotes()
                                .then( publicarHistoricoLotes );

                };

                function publicarLoteProcesos(  lote_procesos ){
                    //console.log(lotes_procesos)
                    vm.lote_procesos = lote_procesos;
                    console.log(vm.lote_procesos)
                };

                function publicarHistoricoLotes( lotes ){

                        //console.log('asd')
                        
                        vm.arr_hist = lotes;

                }


                function informarEstadoProceso( id_proceso_template, id_proceso, estado_lote_proceso ){

                    var clases = ['glyphicon-ok', 'glyphicon-remove', 'glyphicon-time'];
                    var clase_sel = '';
                    console.log(id_proceso_template + ' | ' + id_proceso)

                    /*switch(id_proceso){
                        case 100: '';
                            break;
                        case 200:
                            if(estado_lote_proceso == 1){
                                clase_sel = clases[0];
                            };
                            break;
                        case 300: '';
                            break;
                    };

                    if(id)
                        */

                    return ( clase_sel );
                };

        };
        //FIN CONTROLLER

})();


