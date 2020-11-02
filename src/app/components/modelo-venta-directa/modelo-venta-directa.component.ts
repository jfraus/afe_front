import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
    selector: 'modelo-venta-directa-component',
    templateUrl: './modelo-venta-directa.component.html',
    styleUrls: ['./modelo-venta-directa.component.css'],
    providers:[ModelControllerService,ConfirmationService]
})
export class ModeloVentaDirectaComponent {
    formGroup:  FormGroup;
    visible: boolean;
    modelSelects= [];
    cols =[];
    models=[];
    constructor(private service: ModelControllerService,public confirmationService: ConfirmationService,public messageServices: MessageService, private fb: FormBuilder, private messages: AppValidationMessagesService){
        this.cols = [
            { field: 'code', header: 'Modelo' },
            { field: 'type', header: 'Tipo Modelo' },
            { field: 'year', header: 'Año Modelo' },
            { field: 'description', header: 'Descripción' },
            { field: 'action', header: 'Acción' },
        ];
        this.BuildForm();
        this.fillTable();
    }
    private BuildForm() {
        this.formGroup = this.fb.group({
            modelCode: ['', [Validators.required]],
        });
    }

    fillTable(){
        this.visible = false;
        this.service.get(true).subscribe((response) => {
            
            this.models = response;
            this.models = this.models.map(x => ({
                ...x,
                type: x.type.type
            }));

            console.log(this.models);
            
        });
        this.service.get(false).subscribe((response) => {
            this.modelSelects = response.map(r => (
                { label: r.code, value: r}
            ));
            
        });

    }

    addModel(){
        this.visible = true;
    }

    eliminar(value){
        this.confirmationService.confirm({
            message: '¿Seguro qué desea eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.put({id: value.id, excluded: false}).subscribe((response) =>{
                    this.fillTable();
                });
            },
            reject: () => {
                
            }
        });
       
    }
}

