directives.push(
    {
        name: 'teacherDashboardToaster',
        injections: ['FolderService','SubjectService', (FolderService,SubjectService) => {
            return {
                restrict: 'E',
                scope : {},
                controller: function($scope) {
                    $scope.isDisplayed = false;
                },
                templateUrl: 'exercizer/public/app/components/dashboard/teacher_dashboard/teacher_dashboard_subject_tab/templates/teacher-dashboard-toaster.html',
                compile: function(element, attributes){
                    return {
                        pre: function(scope, element, attributes, controller, transcludeFn){
                        },
                        post: function(scope, element, attributes, controller, transcludeFn){
                            scope.subjectList = [];
                            scope.folderList = [];
                            scope.lowerRight = null;

                            function hide(){
                                scope.isDisplayed = false;
                            }
                            hide();

                            scope.$on('E_DISPLAY_DASHBOARD_TOASTER', function (event, subjectList, folderList) {
                                var length = subjectList.length + folderList.length;
                                if(length === 0){
                                    hide();
                                } else{
                                    scope.isDisplayed = true;
                                    scope.subjectList = subjectList;
                                    scope.folderList = folderList;
                                    checkRightFn(subjectList);
                                }
                            });

                            function checkRightFn(subjectList){
                                scope.lowerRight = 'owner';
                                angular.forEach(subjectList, function(id){
                                    var subject = SubjectService.getById(id);
                                    console.log(subject);
                                    if(model.me.hasRight(subject, 'owner')){
                                        scope.lowerRight = 'owner';
                                    }
                                    if(model.me.hasRight(subject, 'exercizer.manager')){
                                        scope.lowerRight = 'manager';
                                    }
                                    if(model.me.hasRight(subject, 'exercizer.contrib')){
                                        scope.lowerRight = 'contrib';
                                    }
                                    if(model.me.hasRight(subject, 'exercizer.read')){
                                        scope.lowerRight = 'read';
                                    }
                                });
                            }



                            scope.itemList = [
                                {
                                    publicName : 'Propriétés',
                                    actionOnClick : function(){
                                        if(scope.folderList.length == 1){
                                            // folder is selected
                                            var folder = FolderService.folderById(scope.folderList[0]);
                                            scope.$emit('E_EDIT_FOLDER', folder);

                                        }
                                        if(scope.subjectList.length == 1){
                                            // subject is selected
                                            var subject = SubjectService.getById(scope.subjectList[0]);
                                            scope.$emit('E_EDIT_SUBJECT', subject);
                                        }
                                    },
                                    display : function(){
                                        return scope.folderList.length + scope.subjectList.length == 1;
                                    }
                                },
                                {
                                    publicName : 'Partager',
                                    actionOnClick : function(){
                                        var subject = SubjectService.getById(scope.subjectList[0]);
                                        scope.$emit('E_SHARE_SUBJECT', subject);
                                    },
                                    display : function(){
                                        return scope.subjectList.length == 1 && scope.folderList.length == 0 && scope.lowerRight == 'owner';
                                    }
                                },
                                {
                                    publicName : 'Programmer',
                                    actionOnClick : function(){
                                        var subject = SubjectService.getById(scope.subjectList[0]);
                                        scope.$emit('E_SCHEDULE_SUBJECT', subject);
                                    },
                                    display : function(){
                                        return scope.subjectList.length == 1 && scope.folderList.length == 0
                                    }
                                },
                                {
                                    publicName : 'Publier dans la bibliothèque',
                                    actionOnClick : function(){
                                        notify.error('Not implemented yet');
                                    },
                                    display : function(){
                                        return scope.lowerRight == 'owner';
                                    }
                                },
                                {
                                    publicName : 'Copier',
                                    actionOnClick : function(){
                                        scope.$emit("E_COPY_SELECTED_FOLDER_SUBJECT");
                                    },
                                    display : function(){
                                        return scope.lowerRight == 'contrib' || scope.lowerRight == 'manager' ||scope.lowerRight == 'owner';
                                    }
                                },
                                {
                                    publicName : 'Supprimer',
                                    actionOnClick : function(){
                                        scope.$emit('E_REMOVE_SELECTED_FOLDER_SUBJECT');
                                        hide();
                                    },
                                    display : function(){
                                        return scope.lowerRight == 'contrib' || scope.lowerRight == 'manager' ||scope.lowerRight == 'owner';
                                    }
                                }
                            ];
                        }
                    }
                },
            };
        }]
    }
);
