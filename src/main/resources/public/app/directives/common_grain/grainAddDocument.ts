/// <reference path="./../../typings/angular-1.2.d.ts"/>
directives.push(
    {
        name: "grainAddDocument",
        injections: [ () => {
            return {
                restrict: "E",
                scope: {
                    state: '@',
                },
                templateUrl: function($elem, $attr){
                    if($attr.state != 'edit'){
                        console.error($attr.state + " not accepted")
                        throw "";
                    }
                    return "exercizer/public/app/templates/directives/common_grain/"+$attr.state+"/addDocument.html";
                },
                link:(scope : any, element, attrs) => {

                }
            };
        }]
    }
);