import { ng } from 'entcore';
import { automaticCorrection } from '../../common/zonegrain/model';

export const viewFillText = ng.directive('viewFillText',
    [() => {
        return {
            restrict: 'E',
            scope: {
                grainScheduled: '=',
                grainCopy: '=',
                grainCopyList: '=',
                isTeacher: '='
            },
            templateUrl: 'exercizer/public/ts/app/components/grain/filltext/templates/view.html',
            link: (scope: any) => {

                scope.displayCorrection = false;
                scope.doDisplayCorrection = function() {
                    scope.displayCorrection = !scope.displayCorrection;
                    return scope.displayCorrection;
                }

                var result = automaticCorrection(scope.grainScheduled, scope.grainCopy);
                scope.correction = result.answers_result.correction;
                scope.customData = scope.grainCopy.grain_copy_data.custom_copy_data;
                if (!scope.grainCopy.calculated_score) {
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







