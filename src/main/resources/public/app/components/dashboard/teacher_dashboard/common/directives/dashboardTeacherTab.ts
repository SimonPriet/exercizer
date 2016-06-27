directives.push(
    {
        name: 'dashboardTeacherTab',
        injections: [ '$location', '$window', ($location, $window) => {
            return {
                restrict: 'E',
                scope: {
                    currentTab: "=",
                    selectedSubjectScheduled : "="
                },
                templateUrl: 'exercizer/public/app/components/dashboard/teacher_dashboard/common/templates/dashboard-teacher-tab.html',
                link: (scope:any, element, attrs) => {

                    scope.switchTab = function (newTab) {
                        switch (newTab){
                            case 'mySubjects':
                                $location.path('/dashboard');
                                break;
                            case 'correction':
                                $location.path('/dashboard/teacher/correction/');
                                break;
                            case 'library':
                                $location.path('/dashboard');
                                break;
                            default :
                                throw "tab "+newTab+"  missing"
                        }
                    };

                    scope.switchToStudentView = function () {
                        $location.path('/dashboard/student');
                        setTimeout(
                            function(){
                                $window.location.reload();
                            },
                        1);
                    };

                    scope.clickReturnExercizer = function(){
                        scope.selectedSubjectScheduled = null;
                        $location.path('/dashboard');
                    };

                    scope.clickReturnExercizerTab = function(){
                            switch (scope.currentTab){
                                case 'mySubjects':
                                    break;
                                case 'correction':
                                    scope.selectedSubjectScheduled = null;
                                    $location.path('/dashboard/teacher/correction');
                                    break;
                                case 'library':
                                    break;
                                default :
                                    throw "tab "+scope.currentTab+"  missing"
                            }

                    };

                    scope.getTab = function(){
                        switch (scope.currentTab){
                            case 'mySubjects':
                                return "Mes sujets";
                            case 'correction':
                                return "Correction";
                            case 'library':
                                return "Bibliothèque";
                            default :
                                throw "tab "+scope.currentTab+"  missing"
                        }
                    };

                    scope.getSubjectSelectedTitle = function(){
                        if(scope.selectedSubjectScheduled){
                            return scope.selectedSubjectScheduled.title
                        }
                    }
                }
            };
        }]
    }
);
