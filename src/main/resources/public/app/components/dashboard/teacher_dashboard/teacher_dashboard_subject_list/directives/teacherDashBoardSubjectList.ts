directives.push(
    {
        name: 'teacherDashboardSubjectList',
        injections: ['SubjectService', 'FolderService', 'DragService','$location',
            (SubjectService, FolderService, DragService, $location) => {
                return {
                    restrict: 'E',
                    scope: {
                        subject: '='
                    },
                    templateUrl: 'exercizer/public/app/components/dashboard/teacher_dashboard/teacher_dashboard_subject_list/templates/teacher-dashboard-subject-list.html',
                    link: (scope:any) => {

                        /**
                         * INIT
                         */
                        scope.displayList = 'domino';

                        /**
                         * GETTER
                         */

                        scope.subjectList = function () {
                            return SubjectService.getList();
                        };

                        scope.folderList = function () {
                            return FolderService.folderList;
                        };

                        scope.canManageFolder = function (fodler) {
                            return true;
                        };
                        scope.canManageSubject = function (subject) {
                            return true;
                        };

                        scope.getSubjectPicture = function (subject) {
                            var defaultPicture = "/assets/themes/leo/img/illustrations/poll-default.png";
                            return subject.picture || defaultPicture;
                        };

                        scope.getSubjectModificationDate = function (subject) {
                            if(subject){
                                return subject.modified ? "Modifié le " + subject.modified : ""
                            }
                        };

                        /**
                         * EVENT
                         */

                        scope.clickOnFolderTitle = function (folder) {
                            scope.currentFolderId = folder.id;
                        };

                        scope.clickOnSubjectTitle = function (subject) {
                            if (subject.id) {
                                this.$location.path('/teacher/subject/edit/' + subject.id);
                            }
                        };

                        scope.selectFolder = function (folder) {
                            folder.selected = folder.selected ? true : false;
                            scope.$emit("E_SELECT_FOLDER", folder);
                        };
                        scope.selectSubject = function (subject) {
                            subject.selected = subject.selected ? true : false;
                            scope.$emit("E_SELECT_SUBJECT", subject);

                        };

                        scope.clickCreateFolder = function () {
                            scope.$emit("E_CREATE_FOLDER");
                        };

                        scope.goToRoot = function () {
                            scope.currentFolderId = null;
                        };

                        /**
                         * FILTER
                         */

                        scope.filterFolderByParentFolder = function (folder) {
                            if (scope.currentFolderId) {
                                return folder.parent_folder_id == scope.currentFolderId
                            }
                            return folder.parent_folder_id == null;
                        };
                        scope.filterSubjectByParentFolder = function (subject) {
                            if (scope.currentFolderId) {
                                return subject.folder_id == scope.currentFolderId
                            }
                            return subject.folder_id == null;
                        };

                        /**
                         * DRAG
                         */

                        scope.drag = function (item, $originalEvent) {
                            DragService.drag(item, $originalEvent);
                        };

                        scope.dragFolderCondition = function (item) {
                            return DragService.canDragFolderInPage(item);
                        };
                        scope.dragSubjectCondition = function (item) {
                            return DragService.canDragSubjectInPage(item);
                        };

                        scope.dropTo = function (targetItem, $originalEvent) {
                            DragService.dropTo(targetItem, $originalEvent, scope);
                        };

                        scope.dropFolderCondition = function (targetItem) {
                            return DragService.canDropOnFolderInPage(targetItem);

                        };
                        scope.dropSubjectCondition = function (targetItem) {
                            return DragService.canDropOnSubjectInPage(targetItem);
                        };

                        scope.dropToRoot = function ($originalEvent) {
                            DragService.dropTo(null, $originalEvent, scope);
                        };

                    }
                };
            }]
    }
);