import { ng } from 'entcore';

export interface IDateService {
    addDays(date, days);
    addMonths(date, months);
    compare_after(date_a, date_b, value_equal, reset_time?):boolean;
    timestampToDate(timestamp);
    isoToDate(iso);
}

export class DateService implements IDateService {

    static $inject = [];

    constructor() {

    }

    public addDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
    
    public addMonths(date, months) {
        let result = new Date(date); 
        let thisMonth = result.getUTCMonth();               
        result.setUTCMonth(thisMonth+months);
        return result;
    }

    public compare_after(date_a, date_b, value_equal, reset_time?) {
        var a = angular.copy(date_a);
        var b = angular.copy(date_b);
        if(reset_time) {
            a.setHours(0, 0, 0, 0);
            b.setHours(0, 0, 0, 0);
        }
        if (a > b) {
            return true;
        } else if (a < b) {

            return false;
        } else {
            return value_equal;
        }
    }


    public timestampToDate(timestamp) {
        return new Date(parseInt(timestamp) * 1000);
    }

    public addHours(date, h){
        return new Date(date.setHours ( date.getHours() + h ));
    }

    public isoToDate(iso) {
        return new Date(iso);
    }
}

export const dateService = ng.service('DateService', DateService);