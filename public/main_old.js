(function() {
    'use strict';

//var db = null;
    angular
        .module('lotes.main', [
            'ui.router',
            'angularMoment',
            'ui.bootstrap',
            'LocalForageModule'
            // load other modules selected during generation
        ]
    )
    .constant('URL_IMG', {
        'URL_PORTADA': './main/assets/images/libros_portadas/',
        'URL_FOTOAUTOR': './main/assets/images/autores_imagenes/'
    })
    .constant('URL_MODAL', {
        'LISTA_DESEO': './listadeseos/templates/lista-deseos.agregar.html',
        'LECTURA_ESTADOS': './libros/templates/libros.detalle.popup-lectura-estados.html',
        'LIBROS_FILTRAR_ORDENAR': './libros/templates/libros.popover.filtrar-ordenar.html',
        'SYS_ALERT_GUARDARDATOS': './main/templates/alert-guardar-datos.html'
    })
    .run(runBlock)
    .config(config);


    /*
    runBlock.$inject = ['$rootScope', '$state', '$stateParams', 'amMoment'];
    function runBlock($rootScope, $state, $stateParams, amMoment) {

        amMoment.changeLocale('es');
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
    */

    runBlock.$inject = ['$rootScope', '$state', '$stateParams', 'amMoment'];
    function runBlock($rootScope, $state, $stateParams, amMoment) {

        amMoment.changeLocale('es');

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }


    config.$inject = ['$stateProvider', '$urlRouterProvider', '$localForageProvider'];
    function config($stateProvider, $urlRouterProvider, $localForageProvider) {

        $localForageProvider.config({
            name: 'lotes' // nombre de la base de datos (para mi seria una tabla,digamos).
        });        

        
        //////////
        // Home //
        //////////

       /* 
       $stateProvider
            .state('biblioteca', {
                url: "/biblioteca",
                //abstract: true,
                templateUrl: "main/templates/tabs.html"
                //contoller: 'TabController'
            })
            /*.state('biblioteca', {
                url: "/biblioteca",
                //abstract: true,
                templateUrl: "main/templates/home.html"
                //contoller: 'TabController'
            })*/

    }
        


})();