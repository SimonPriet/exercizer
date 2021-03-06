import { ng } from 'entcore';

class StudentDashboardController {

    /**
     * INJECT
     */
    private _$location;
    private _$scope;
    private _subjectCopyService;
    private _$window;


    static $inject = [
        '$location',
        '$scope',
        'SubjectCopyService',
        '$window'
    ];

    constructor($location, $scope, SubjectCopyService, $window) {
        var self = this;
        this._$location = $location;
        this._$scope = $scope;
        this._subjectCopyService = SubjectCopyService;
        this._$window = $window;
        //this._subjectCopyService.loadSubjectCopyList();
    }

    public switchToTeacherView(){
        this._$location.path('/dashboard');
        var self = this;
        setTimeout(
            function(){
                self._$window.location.reload();
            },
            1);
    }


}

export const studentDashboardController = ng.controller('StudentDashboardController', StudentDashboardController);