import { ng, idiom } from 'entcore';
import { SerializationHelper, MapToListHelper } from '../models/helpers';
import { ISubjectLessonLevel, SubjectLessonLevel } from '../models/domain';

export interface ISubjectLessonLevelService {
    resolve(): Promise<boolean>;
    getList(): ISubjectLessonLevel[];
    resolveBySubjectIdList(subjectIds:number[]):Promise<boolean>;
    getBySubjectId(subjectId:number): ISubjectLessonLevel;
}

export class SubjectLessonLevelService implements ISubjectLessonLevelService {

    static $inject = [
        '$q',
        '$http'
    ];

    private _listMappedById: {[id:number]:ISubjectLessonLevel};
    private _listMappedBySubjectId: {[subjectId:number]:ISubjectLessonLevel};

    constructor
    (
        private _$q,
        private _$http
    )
    {
        this._$q = _$q;
        this._$http = _$http;
    }

    public resolve = function():Promise<boolean> {
        var self = this,
            deferred = this._$q.defer(),
            request = {
                method: 'GET',
                url: 'exercizer/subject-lesson-levels'
            };
        
        if (!angular.isUndefined(this._listMappedById)) {
            deferred.resolve(true);
        } else {
            this._$http(request).then(
                function(response) {
                    self._listMappedById = {};

                    angular.forEach(response.data, function (subjectLessonLevelObject) {
                        var subjectLessonLevel = SerializationHelper.toInstance(new SubjectLessonLevel(), JSON.stringify(subjectLessonLevelObject));
                        subjectLessonLevel.label = idiom.translate(subjectLessonLevel.label);
                        self._listMappedById[subjectLessonLevel.id] = subjectLessonLevel;
                    });

                    deferred.resolve(true);
                },
                function() {
                    deferred.reject('exercizer.error');
                }
            );
        }
        return deferred.promise;
    };

    public getList = function():ISubjectLessonLevel[] {
        return MapToListHelper.toList(this._listMappedById);
    };
    
    public resolveBySubjectIdList = function(subjectIds:number[]):Promise<boolean> {
        var self = this,
            deferred = this._$q.defer();
        
        
        if (subjectIds.length === 0) {
            deferred.resolve(true);
        } else {
            
            // the resulting ajax result is sorted by subject id
            subjectIds = subjectIds.sort(function (id1:number, id2:number) {
                return id1 - id2;
            });
            
            var request = {
                method: 'POST',
                url: 'exercizer/subject-lesson-levels-by-subject-ids',
                data: {
                    subject_id_list: subjectIds
                }
            };

            var callBackend = false;

            if (angular.isUndefined(this._listMappedBySubjectId)) {
                this._listMappedBySubjectId = {};
                callBackend = true;
            } else {
                angular.forEach(subjectIds, function (subjectId:number) {
                    if (!callBackend && angular.isUndefined(this._listMappedBySubjectId[subjectId])) {
                        callBackend = true;
                    }
                }, this);
            }

            if (!callBackend) {
                deferred.resolve(true);
            } else {
                this._$http(request).then(
                    function (response) {
                        for (var i = 0; i < subjectIds.length; ++i) {
                            var subjectLessonLevelObject = response.data[i];
                            var subjectLessonLevel = SerializationHelper.toInstance(new SubjectLessonLevel(), JSON.stringify(subjectLessonLevelObject));
                            subjectLessonLevel.label = idiom.translate(subjectLessonLevel.label);
                            self._listMappedBySubjectId[subjectIds[i]] = subjectLessonLevel;
                        }

                        deferred.resolve(true);
                    },
                    function () {
                        deferred.reject('exercizer.error');
                    }
                );
            }
        }
        
        return deferred.promise;
    };

    public getBySubjectId = function(subjectId:number): ISubjectLessonLevel {
        return this._listMappedBySubjectId[subjectId];
    };
}

export const subjectLessonLevelService = ng.service('SubjectLessonLevelService', SubjectLessonLevelService);