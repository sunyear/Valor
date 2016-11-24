(function(){
	'use strict';

	angular
		.module('lotes.lote')
		.constant('TABLA', {
        		'NOMBRE': 'lotes_'
    		}
    	)
    	.constant('PROCESOS',{
    			'ID_PROCESO_PREVAL': 100,
    			'ID_PROCESO_PRECARGA': 200,
    			'ID_PROCESO_CALIDAD': 300
    		}
    	)
    	.constant('ESTADOS_LOTES',{
    			1 : 'ACEPTADO',
    			2 : 'RECHAZADO',
    			3 : 'OBSERVADO',
    			4 : 'EN PROCESO'
    		}
    );

})();