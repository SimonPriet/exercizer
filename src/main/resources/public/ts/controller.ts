routes.define(function($routeProvider){
    $routeProvider
        .when('/dashboard', {
            action: 'dashboard'
        })
        .when('/subject/edit/:subjectId/', {
            action: 'editSubject'
        })
        .when('/subject/copy/perform/:subjectCopyId/', {
            action: 'performSubjectCopy'
        })
        .when('/subject/copy/view/:subjectCopyId/', {
            action: 'viewSubjectCopy'
        })
        .otherwise({
            redirectTo: '/dashboard'
        });
});

var directives = [];

function ExercizerController($scope, $rootScope, model, template, route, date, $route) {

    const teacherProfile = 'Teacher';
    const studentProfile = 'Student';
    var _userProfile = teacherProfile; // FIXME model.me.profiles

    route({
        dashboard: function () {
            if (_userProfile === teacherProfile) {
                template.open('main', 'teacher-dashboard');
            } else if (_userProfile === studentProfile) {
                template.open('main', 'student-dashboard');
            } else {
                template.open('main', '401-exercizer');
            }
        },
        editSubject: function () {
            if (_userProfile === teacherProfile) {
                template.open('main', 'edit-subject');
            } else if (_userProfile === studentProfile) {
                template.open('main', 'student-dashboard');
            } else {
                template.open('main', '401-exercizer');
            }
        },
        performSubjectCopy: function () {
            if (_userProfile === studentProfile) {
                template.open('main', 'perform-subject-copy');
            } else if (_userProfile === teacherProfile) {
                template.open('main', 'teacher-dashboard');
            } else {
                template.open('main', '401-exercizer');
            }
        },
        viewSubjectCopy: function () {
            if (_userProfile === teacherProfile || _userProfile === studentProfile) {
                template.open('main', 'view-subject');
            } else {
                template.open('main', '401-exercizer');
            }
        }
    });

    $route.reload();
}

(window as any).AngularExtensions = {
    init: function(module){

        /**
         * Filter
         */

        module.filter('orderObjectBy', function() {
            return function(items, field, reverse) {
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });
                filtered.sort(function (a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
                if(reverse) filtered.reverse();
                return filtered;
            };
        });

        /**
         * Constants
         */
        // FIXME
        module.constant("serverUrl", "http://foo.com");

        /**
         * Services
         */

        module.service('SubjectService', SubjectService);
        module.service('SubjectScheduledService', SubjectScheduledService);
        module.service('SubjectCopyService', SubjectCopyService);
        module.service('GrainService', GrainService);
        module.service('GrainScheduledService', GrainScheduledService);
        module.service('GrainCopyService', GrainCopyService);
        module.service('GrainTypeService', GrainTypeService);
        module.service('SimpleAnswerService', SimpleAnswerService);
        module.service('QcmService', QcmService);
        module.service('OpenAnswerService', OpenAnswerService);
        module.service('OrderService', OrderService);
        module.service('DragService', DragService );
        module.service('FolderService', FolderService );

        /**
         * Controllers
         */
        module.controller('TeacherDashboardController', TeacherDashboardController);
        module.controller('EditSubjectController', EditSubjectController);
        module.controller('PerformSubjectCopyController', PerformSubjectCopyController);

        /**
         * Directives
         */
        directives.forEach((item) => {
            module.directive(item.name, item.injections);
        });
    }
};

