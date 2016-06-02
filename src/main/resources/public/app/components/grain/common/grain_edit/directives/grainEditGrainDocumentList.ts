directives.push(
    {
        name: 'grainEditGrainDocumentList',
        injections:
            [
                (
                ) => {
                    return {
                        restrict: 'E',
                        scope: {
                            grain: '='
                        },
                        templateUrl: 'exercizer/public/app/components/grain/common/grain_edit/templates/grain-edit-grain-document-list.html',
                        link:(scope:any) => {
                            scope.removeGrainDocument = function(grainDocument:IGrainDocument) {
                                scope.$emit("E_REMOVE_GRAIN_DOCUMENT", scope.grain, grainDocument);
                            };
                        }
                    };
                }
            ]
    }
);