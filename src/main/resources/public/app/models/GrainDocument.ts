interface IGrainDocument {
    id:number;
}

class GrainDocument implements IGrainDocument {
    
    private _id:number;
    
    constructor(id?:number) {
        this._id = id;
    }
    
    get id():number {
        return this._id;
    }

    set id(value:number) {
        this._id = value;
    }
}