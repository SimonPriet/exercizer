import { ng } from 'entcore';

export const viewMultipleAnswer = ng.directive('viewMultipleAnswer',
    ['MultipleAnswerService', (MultipleAnswerService) => {
        return {
            restrict: 'E',
            scope: {
                grainScheduled: '=',
                grainCopy: '=',
                grainCopyList: '=',
                isTeacher: '='
            },
            templateUrl: 'exercizer/public/ts/app/components/grain/multiple_answer/templates/view-multiple-answer.html',
            link: (scope:any) => {

                scope.displayCorrection = false;
                scope.doDisplayCorrection = function() {
                    scope.displayCorrection = !scope.displayCorrection;
                    return scope.displayCorrection;
                }

                var result = MultipleAnswerService.automaticCorrection(scope.grainScheduled, scope.grainCopy);
                scope.isCorrect = result.answers_result;
                if (angular.isUndefined(scope.grainCopy.calculated_score) || scope.grainCopy.calculated_score === null) {
                    scope.grainCopy.calculated_score = result.calculated_score;
                    scope.$emit('E_UPDATE_GRAIN_COPY', scope.grainCopy);
                }

                scope.updateGrainCopy = function () {
                    if (scope.isTeacher) {
                        scope.$emit('E_UPDATE_GRAIN_COPY', scope.grainCopy);
                    }
                };
            }
        };
    }]
);







