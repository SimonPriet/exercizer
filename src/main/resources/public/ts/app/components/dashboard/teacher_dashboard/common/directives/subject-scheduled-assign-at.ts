import { ng } from 'entcore';

export const subjectScheduleAssignAt = ng.directive('subjectScheduledAssignAt', [() => {
        return {
            restrict: 'E',
            scope: {
                isDisplayed: "=",
                subjectScheduled: "="
            },
            templateUrl: 'exercizer/public/ts/app/components/dashboard/teacher_dashboard/common/templates/subject-scheduled-assign-at.html',
            link: (scope:any, element, attrs) => {

                 scope.isDisplayed = false;
                scope.subject = [];

                // event to display model
                scope.$on("SEE_SUBJECT_SCHEDULED_ASSIGN_AT", function(event, data) {
                    scope.isDisplayed = true;
                    scope.subjectScheduled = data.subjectScheduled;
                });

                // hide model
                scope.hide = function () {
                    scope.isDisplayed = false;
                };
            }
        };
    }]
);
