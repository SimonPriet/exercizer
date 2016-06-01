interface IMultipleAnswerCustomCopyData {
    filled_answer_list:any[];
}

class MultipleAnswerCustomCopyData implements IMultipleAnswerCustomCopyData {

    private _filled_answer_list:any[];

    constructor
    (
        filled_answer_list?:any[]
    )
    {
        this._filled_answer_list = filled_answer_list || [];
    }

    get filled_answer_list():any[] {
        return this._filled_answer_list;
    }

    set filled_answer_list(value:any[]) {
        this._filled_answer_list = value;
    }
}