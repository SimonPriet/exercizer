directives.push(
    {
        name: 'multipleAnswerPerform',
        injections: [
            'E_UPDATE_GRAIN_COPY',
            (
                E_UPDATE_GRAIN_COPY
            ) => {
                return {
                    restrict: 'E',
                    scope: {
                        grainCopy: '='
                    },
                    templateUrl: 'exercizer/public/app/components/grain/multiple_answer/templates/perform-multiple-answer.html',
                    link:(scope:any) => {

                        scope.updateGrainCopy = function() {
                            scope.$emit(E_UPDATE_GRAIN_COPY + scope.grainCopy.subject_copy_id, scope.grainCopy);
                        };

                    }
                };
            }
        ]
    }
);






