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
        
        this.messageServices.add({key: 'error',severity: 'error', summary: error.error.message, detail: `Codigo de error ${error.status}`});
    }

    public errorLogin(){
        this.messageServices.add({key: 'error',severity: 'error', summary: "Error", detail: `Credenciales Invalidas`});

    }
}
