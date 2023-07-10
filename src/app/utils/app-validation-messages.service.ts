import {  Injectable } from '@angular/core';

@Injectable()
export class AppValidationMessagesService{
    _messagesMaxLenght: String;
    _messagesRequired: String;
    _messagesMinLenght: String;
    _messagesPattern: String;
    _messagesMin: String;

    get messagesPattern(): String {
        return this._messagesPattern;
    }

    set messagesPattern(pattern){
        this._messagesPattern = `*No puede contener caracteres ${pattern}`;
    }

    get messagesMaxLenght(): String {
        return this._messagesMaxLenght;
    }
    set messagesMaxLenght(maxlenght){
        this._messagesMaxLenght = `*La longitud no puede ser mayor a ${maxlenght}`;
    }

    get messagesRequired(): String {
        return this._messagesRequired;
    }

    set messagesRequired(value){
        this._messagesRequired = `*Campo requerido`;
    }

    get messagesMinLenght(): String{
        return this._messagesMinLenght;
    }
    set messagesMinLenght(minlenght) {
        this._messagesMinLenght = `*La longitud no puede ser menor a ${minlenght}`;
    }

    set messagesMin(minlenght) {
        this._messagesMin = `*El valor minimo es de ${minlenght}`;
    }

    get messagesMin(): String{
        return this._messagesMin;
    }



    public getValidationMessagesWithName(name){
        let object = {};
        object[name] = [];

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
        if(this._messagesMin){
            object[name].push({
                type: 'min',
                message: this.messagesMin
            })
        }
        return object;
    }

}
