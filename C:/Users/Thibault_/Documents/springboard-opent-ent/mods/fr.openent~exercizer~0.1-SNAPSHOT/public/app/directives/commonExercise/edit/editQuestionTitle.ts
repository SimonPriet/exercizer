/// <reference path="./../../../typings/angular-1.2.d.ts"/>
var editQuestionTitle = [ () => {
    return {
        restrict: "E",
        scope : {
            titleModel : "=",
            onBlurFunction : "&"
        },
        templateUrl: 'exercizer/public/app/templates/directives/commonExercise/editQuestionTitle.html',
        link:(scope : any, element, attrs) => {


        }
    };
}];