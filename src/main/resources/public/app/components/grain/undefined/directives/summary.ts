directives.push(
    {
        name: 'summary',
        injections: [() => {
                    return {
                        restrict: 'E',
                        scope: {
                            subjectScheduled: '=',
                            subjectCopy: '=',
                            firstGrainCopy: '='
                        },
                        templateUrl: 'exercizer/public/app/components/grain/undefined/templates/summary.html',
                        link:(scope:any) => {
                            scope.begin = function () {
                                scope.$emit('E_CURRENT_GRAIN_COPY_CHANGED', scope.firstGrainCopy);
                            };
                            
                        }
                    };
                }
            ]
    }
);

