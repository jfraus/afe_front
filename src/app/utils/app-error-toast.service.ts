import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable()
export class ErrorToastService{
    
    constructor(public messageServices: MessageService){}

    public executeError(error:any){
        this.messageServices.clear();
        this.openToast(error);
    }

    private openToast(error:any){
        this.messageServices.add({key: 'error',severity: 'error', summary: error.error.message, detail: "Código de error ${error.status}"});
    }

    public errorLogin(){
        this.messageServices.add({key: 'error',severity: 'error', summary: 'Error', detail: 'Credenciales inválidas'});
    }

    public errorToken(){
        this.messageServices.add({key: 'error',severity: 'error', summary: 'Error', detail: 'La sesión expiro'});
    }
}
