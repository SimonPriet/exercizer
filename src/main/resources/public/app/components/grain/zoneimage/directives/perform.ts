directives.push(
    {
        name: 'performZoneImage',
        injections: [() => {
            return {
                restrict: 'E',
                scope: {
                    grainCopy: '='
                },
                templateUrl: 'exercizer/public/app/components/grain/zoneimage/templates/perform.html',
                link: (scope: any) => {
                    scope.grainCopy.grain_copy_data.custom_copy_data = new zoneimage.CustomData(scope.grainCopy.grain_copy_data.custom_copy_data);

                    scope.usedAnswers = [];

                    scope.updateGrainCopy = () => {
                        scope.$emit('E_UPDATE_GRAIN_COPY', scope.grainCopy);
                    };

                    scope.answer = (iconZone: zoneimage.IconZone, $item: string) => {
                        scope.removeAnswer(iconZone);
                        iconZone.answer = $item;
                        scope.usedAnswers.push($item);
                        scope.updateGrainCopy();
                    };

                    scope.removeAnswer = ($item: zoneimage.IconZone) => {
                        if (!$item.answer) {
                            return;
                        }
                        var i = scope.usedAnswers.indexOf($item.answer);
                        scope.usedAnswers.splice(i, 1);
                        $item.answer = '';
                        scope.updateGrainCopy();
                    };

                    scope.availableOption = (option) => scope.usedAnswers.indexOf(option) === -1;
                }
            };
        }]
    }
);







