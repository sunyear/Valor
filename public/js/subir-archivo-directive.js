(function(){
	'use strict';

	angular
		.module('lotes.lote')
		.directive('onReadFile', onReadFile);

		function onReadFile($parse){

			var directive = {
				scope: false,
				//require: 'ngModel',
				restrict: 'A',
				link: linkFunc

			};

			return directive;

			function linkFunc(scope, element, attrs){

				element.bind('change', function(e) {
                
	                var onFileReadFn = $parse(attrs.onReadFile);
	                var reader = new FileReader();
	                var fileName = element[0].files[0].name;
	                var arrReturn = [fileName];
	                
	                reader.onload = function() {
	                    //var fileContents = reader.result;
	                    // invoke parsed function on scope
	                    // special syntax for passing in data
	                    // to named parameters
	                    // in the parsed function
	                    // we are providing a value for the property 'contents'
	                    // in the scope we pass in to the function
	                    arrReturn.push(reader.result)
	                    scope.$apply(function() {
	                        onFileReadFn(scope, {
	                            'contents' : arrReturn//fileContents
	                        });
	                    });
	                };
	                reader.readAsText(element[0].files[0]);
	                //console.log(element[0].files[0].name)
	                //reader.readAsArrayBuffer(element[0].files[0]);
				})
			};
		};
})();