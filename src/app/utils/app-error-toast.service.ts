import { Injectable, Component } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable()
export class ErrorToastService{
    constructor(public messageServices: MessageService){}

    public executeError(error){
        this.messageServices.clear();

        //Manejo de errores
        this.openToast(error);
    }

    private openToast(error){

        this.messageServices.add({key: 'error',severity: 'error', summary: error.message, detail: `status code ${error.status}`});
    }
}
