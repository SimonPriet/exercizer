import { ng, $ } from 'entcore';
import { CorrectOrderHelper } from '../../../../../models/helpers';

export const grainCopyHeader = ng.directive('grainCopyHeader',
    ['GrainTypeService', (GrainTypeService) => {
        return {
            restrict: 'E',
            scope : {
                grainCopy: '=',
                grainCopyList: '=',
                isTeacher: '=?',
                displayCorrection: '=?',
                onDisplayCorrection: '&?',
                displayHint: '=',
            },
            templateUrl: 'exercizer/public/ts/app/components/grain/common/grain_copy/templates/grain-copy-header.html',
            link:(scope:any) => {
                scope.grainType = GrainTypeService.getById(scope.grainCopy.grain_type_id);
                scope.isAnswerHintFolded = true;
                
                scope.hasAnswerHint = function() {
                    return !angular.isUndefined(scope.grainCopy.grain_copy_data.answer_hint) && scope.grainCopy.grain_copy_data.answer_hint  !== null;
                };

                scope.displayCorrectAnswerButton = function() {
                    return !scope.isTeacher && !angular.isUndefined(scope.grainCopy.final_score)
                    && !angular.isUndefined(scope.displayCorrection) && (scope.grainCopy.final_score != scope.grainCopy.grain_copy_data.max_score);
                };
                
                scope.toggleGrainCopyHint = function() {
                    scope.isAnswerHintFolded = !scope.isAnswerHintFolded;
                };

                scope.getCorrectOrder = function() {
                    return CorrectOrderHelper.getCorrectOrder(scope.grainCopy, scope.grainCopyList);
                };

                scope.scrollAndDisplayCorrection = function () {
                    if (scope.onDisplayCorrection()) {
                        $("html, body").animate({
                            scrollTop: $("#" + scope.grainCopy.id + "-correction").offset().top - $(".navbar").height() - 10
                        }, 500);
                    }
                }
            }
        };
    }]
);
