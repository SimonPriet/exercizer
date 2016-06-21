directives.push(
    {
        name: 'teacherDashboardCorrectionSubjectScheduledList',
        injections: ['SubjectScheduledService', 'SubjectService', 'GroupService','DateService','SubjectCopyService','$location','$route', (SubjectScheduledService, SubjectService, GroupService, DateService,SubjectCopyService, $location, $route) => {
            return {
                restrict: 'E',
                scope: {
                    selectedSubjectScheduled : "="
                },
                templateUrl: 'exercizer/public/app/components/dashboard/teacher_dashboard/teacher_dashboard_correction_tab/templates/teacher-dashboard-correction-subject-scheduled-list.html',
                link: (scope:any) => {

                    /**
                     * INIT
                     */
                    scope.subjectScheduledList = [];
                    // Date data
                    scope.today = new Date();
                    scope.dateAMonthAgo = DateService.addDays(scope.today, -30);
                    scope.dateInAMonth = DateService.addDays(scope.today, 30);
                    scope.search = {
                        beginDate : scope.dateAMonthAgo,
                        endDate : scope.dateInAMonth
                    };

                    /**
                     * LOAD
                     */
                    // load subject scheduled
                    // revolve true means teacher
                    SubjectScheduledService.resolve(true).then(
                        function () {
                            scope.subjectScheduledList = SubjectScheduledService.getList();
                            if (scope.subjectScheduledList.length !== 0) {
                                // get auto complete
                                var subjectId = scope.subjectScheduledList[0].subject_id;
                                SubjectService.resolve().then(
                                    function(){
                                        var subject = SubjectService.getById(subjectId);
                                        if (subject instanceof Subject) {
                                            GroupService.getList(subject).then(
                                                function (data) {
                                                    scope.autocomplete = {
                                                        groupList: createListAutoComplete(data.groups.visibles)
                                                    }
                                                }
                                            )
                                        } else {
                                            console.error(subject, 'is not an instance of Subject');
                                            throw "";
                                        }
                                    }
                                );
                            }
                        }
                    );

                    function createListAutoComplete(list) {
                        var array = [];
                        angular.forEach(list, function (value) {
                            var obj = {
                                name: value.name,
                                id: value.id,
                                toString: function () {
                                    return this.name;
                                }
                            };
                            array.push(obj);
                        });
                        return array;
                    }

                    /**
                     * GET subject Scheduled information
                     */
                    scope.getSubjectScheduledPicture = function (subjectScheduled) {
                        return subjectScheduled.picture || '/assets/themes/leo/img/illustrations/poll-default.png';
                    };

                    scope.numberOfCopySubmitted = function (subjectScheduled){
                        var list = SubjectCopyService.getListBySubjectScheduled(subjectScheduled),
                            res = 0;
                        angular.forEach(list, function(copy){
                           if(copy.submitted_date){
                               res++
                           }
                        });
                        return res;
                    };

                    scope.numberOfCopy = function (subjectScheduled){
                        var list = SubjectCopyService.getListBySubjectScheduled(subjectScheduled);
                        return list.length;
                    };

                    function isListCopyCorrected(list){
                        if(list){
                            var res = true;
                            angular.forEach(list, function(copy){
                                if(!copy.is_corrected){
                                    res = false
                                }
                            });
                            return res;
                        } else{
                            return false;
                        }
                    }

                    scope.stateTextSubjectScheduled = function(subjectScheduled){
                        var list = SubjectCopyService.getListBySubjectScheduled(subjectScheduled);
                        if(isListCopyCorrected(list)){
                            return "Corrigé";
                        } else{
                            return "Non corrigé";
                        }
                    };

                    scope.stateSubjectScheduled = function(subjectScheduled){
                        var list = SubjectCopyService.getListBySubjectScheduled(subjectScheduled);
                        if(isListCopyCorrected(list)){
                            return "is_corrected";
                        } else{
                            return "is_not_corrected";
                        }
                    };

                    /**
                     * EVENT
                     */

                    // autocomplete
                    scope.clickOnItem = function (selectedItem) {
                        scope.search.groupSelected = selectedItem;
                    };

                    scope.resetGroupSelected = function () {
                        scope.search.groupSelected = null;
                    };

                    scope.clickFilter = function (filter) {
                        scope.search.filter = scope.search.filter == filter ? null : filter;
                    };

                    scope.clickOnSubjectScheduled = function(subjectScheduled){
                        scope.selectedSubjectScheduled = subjectScheduled;
                        $location.path('/dashboard/teacher/correction/'+subjectScheduled.id);
                    };

                    /**
                     * FILTER ANGULAR
                     */

                    scope.filterOnSubjectScheduledDueDate = function (begin, end) {
                        return function (subjectScheduled) {
                            var dueDate = DateService.isoToDate(subjectScheduled.due_date);
                            if (!begin || !end) {
                                throw "begin or end date in params missing"
                            }
                            return DateService.compare_after(dueDate, begin) && DateService.compare_after(end, dueDate);
                        }
                    };
                    scope.filterOnGroupSelected = function (groupSelected) {
                        return function (subjectScheduled) {
                            if (!groupSelected) {
                                return true;
                            } else {
                                var res = false;
                                angular.forEach(subjectScheduled.scheduled_at.groupList, function (group) {
                                    if (group._id == groupSelected.id) {
                                        res = true
                                    }
                                });
                                return res;

                            }
                        }
                    };

                    scope.filterOnGroupSelectedState = function(filter){
                        return function (subjectScheduled){
                            if(!filter){
                                return true;
                            } else{
                                var list = SubjectCopyService.getListBySubjectScheduled(subjectScheduled);
                                if(filter == 'corrected'){
                                    return isListCopyCorrected(list);
                                } else if(filter == 'notCorrected'){
                                    return !isListCopyCorrected(list);
                                } else{
                                    throw "filter unknown"
                                }
                            }
                        }
                    }
                }
            };
        }]
    }
);