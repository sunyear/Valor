(function(){
    'use strict';
    
    angular
        .module('lotes.lote', [
                //'biblioteca.libros.categorias',
                //'ngSanitize'
                'ui.router',
                'ui.bootstrap'
            ]
        )
        .config(config);
        
        config.$inject = ['$stateProvider','$urlRouterProvider'];
        function config($stateProvider, $urlRouterProvider){

            $urlRouterProvider.when("", "/validador");
            $urlRouterProvider.when("/", "/validador");
            // $urlRouterProvider.when("/", "/tab/menu");
            $urlRouterProvider
                //.when('/a?idAutor', '/autores/:idAutor')
                //.when('/autor/:idAutor', '/autores/:idAutor')
               // .when('/l?idLibro', '/libros/:idLibro')
                //.when('/libro/:idLibro', '/libros/:idLibro')
                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                //.otherwise('/biblioteca/libros/listado/todos');
                //.otherwise('/biblioteca/libros/panel-central');
                .otherwise('/validador');

            $stateProvider          
                /******************************
                ***** SECCION LIBROS *********
                *******************************/
                .state('lotes', {
                    cache: false,
                    url: '/validador',
                    templateUrl: './views/lote-template.html',
                    controller: 'LoteController',
                    controllerAs: 'vm'
    
                    /*,
                    resolve: {
                        libros: obtenerLibros
                    }*/
                })
                /*
                .state('detalle', {
                    parent: 'libros',
                    cache: false,
                    url: '/detalle/{idLibro:[0-9]{1,20}}',
                    views: {
                        'libros@biblioteca': {
                            templateUrl: './libros/templates/libros.detalle.html',
                            controller: 'LibroDetalleController',
                            controllerAs: 'detvm'
                        }
                    },
                    resolve: {
                        libro: obtenerDatosLibro
                    }
                })
                */
        };


        //METODO QUE OBTIENE LOS LIBROS EN FUNCION DEL PARAMETRO $stateParams
        //$stateParamas puede ser: 'todos'; 'favoritos'; 'leidos'; 'noleidos'
        //SE USA EN EL RESOLVE DEL STATE libros.listado
        function obtenerLibros($stateParams, librosService){
            return ( librosService.obtenerDatosListado( $stateParams.filtro ) );
        }


        //METODO QUE OBTIENE LOS DATOS DEL LIBRO SELECCIONADO. SE RETORNA UNA PROMISE
        //SE USA EN EL RESOLVE DEL STATE libros.detalle
        function obtenerDatosLibro($stateParams, librosService){

            //console.log($stateParams)
            return ( librosService.cargarLibro( $stateParams.idLibro ) );
        }


        function obtenerInfoLecturas($stateParams, lecturasService, libro){

            var datos = [];

            if(libro.leyendo){
                lecturasService
                    .obtenerLecturas()
                    .then(
                        function procesar( lecturas ){
                            //console.log(lecturas)
                        }
                    );
            }

            datos.push(libro);

            return ( datos );
        }

        

})();

/*
.directive('requerirAutor', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.requerirAutor = function(modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be invalid
                  scope.formulario.autorOK = false;
                  return false;
                }

                // it is valid
                scope.formulario.autorOK = true;
                return true;
              };
            }
        };
    }
)
.directive('validarAnio', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.validarAnio = function(modelValue, viewValue) {

               var INTEGER_REGEXP = /^\-?\d+$/;

               //&& ((viewValue >= attrs.min) && (viewValue <= attrs.max))

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be valid
                  scope.formulario.anioPublicacionOK = true;
                  return true;
                }

                if ( INTEGER_REGEXP.test(viewValue) ) {

                    // it is valid
                    if(viewValue >= 0 && viewValue <= 2016){
                        scope.formulario.anioPublicacionOK = true;
                        return true;
                    }
                }

                // it is invalid
                scope.formulario.anioPublicacionOK = false;
                return false;
              };
            }
        };
    }
)
.directive('validarPaginas', 
    function() {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
              ctrl.$validators.validarPaginas = function(modelValue, viewValue) {

                var INTEGER_REGEXP = /^\-?\d+$/;

                if (ctrl.$isEmpty(modelValue)) {
                  // consider empty models to be valid
                  scope.formulario.paginasOK = true;
                  return true;
                }

                if ( INTEGER_REGEXP.test(viewValue) ){
                    if( viewValue >= 0 ) {
                        // it is valid
                        scope.formulario.paginasOK = true;
                        return true;
                    }
                }

                // it is invalid
                scope.formulario.paginasOK = false;
                return false;
              };
            }
        };
    }
)
.directive('autocompletar', 
    function($document) {

        return {
            require: 'ngModel',
            restrict: 'A',
            //template: '<div>asdasd</div>'
            link: function(scope, element, attrs, ctrl) {
            // get weather details

            var top = (element[0].offsetWidth) - 10;
            var left = (element[0].offsetHeight);

            console.log(element[0].offsetHeight)

            var template = '<div style="background-color:#666; position: absolute; top:'+ top +'px; left:20px;z-index:20; width:50px; border:solid 1px #EEE">LALALA</div>';

            $document.find('body').append(template);

            element.on('keyup', function(event){
                
            })

           
            }
        }
        
    }
);
*/