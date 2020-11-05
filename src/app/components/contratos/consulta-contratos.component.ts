import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
    selector: 'consulta-contratos-component',
    templateUrl: './consulta-contratos.component.html',
    styleUrls: ['./consulta-contratos.component.css'],
    providers:[ModelControllerService,ConfirmationService]
})
export class ConsultaContratosComponentComponent {
    cols=[];
    constructor(){
        this.cols = [
            { field: 'code', header: 'Modelo' },
            { field: 'type', header: 'Tipo Modelo' },
            { field: 'year', header: 'Año Modelo' },
            { field: 'description', header: 'Descripción' },
            { field: 'action', header: 'Acción' },
        ];
    }
}

