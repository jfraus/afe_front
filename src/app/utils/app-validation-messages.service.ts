import {  Injectable } from '@angular/core';

@Injectable()
export class AppValidationMessagesService{
    _messagesMaxLenght: String;
    _messagesRequired: String;
    _messagesMinLenght: String;
    _messagesPattern: String;

    get messagesPattern(): String {
        return this._messagesPattern;
    }

    set messagesPattern(pattern){
        this._messagesPattern = `It does not comply with the correct format of ${pattern}`;
    }

    get messagesMaxLenght(): String {
        return this._messagesMaxLenght;
    }
    set messagesMaxLenght(maxlenght){
        this._messagesMaxLenght = `*Cannot be more than ${maxlenght} characters long`;
    }

    get messagesRequired(): String {
        return this._messagesRequired;
    }

    set messagesRequired(value){
        this._messagesRequired = `*Required field`;
    }

    get messagesMinLenght(): String{
        return this._messagesMinLenght;
    }
    set messagesMinLenght(minlenght) {
        this._messagesMinLenght = `*Cannot be min than ${minlenght} characters long`;
    }



    public getValidationMessagesWithName(name){
        let object = {};
        object[name] = [];
        console.log(this._messagesRequired);

        if(this._messagesMaxLenght){
            object[name].push({
                type: 'maxlength',
                message: this.messagesMaxLenght
            });
        }
        if(this._messagesMinLenght){
            object[name].push({
                type: 'minlength',
                message: this.messagesMinLenght
            });
        }
        if(this._messagesRequired){
            object[name].push({
                type: 'required',
                message: this.messagesRequired
            });
        }
        if(this._messagesPattern){
            object[name].push({
                type: 'pattern',
                message: this.messagesPattern
            })
        }
        return object;

    }

}
