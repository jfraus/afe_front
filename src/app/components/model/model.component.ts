import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
    selector: 'model-component',
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.css'],
    providers: [ModelControllerService, ConfirmationService]
})
export class ModelComponent implements OnInit {
    formGroup: FormGroup;
    visible: boolean;
    modelSelects = [];
    cols = [];
    models = [];
    searchButtonDisable: boolean = true;
    constructor(private service: ModelControllerService, public confirmationService: ConfirmationService, public messageServices: MessageService, private fb: FormBuilder, private messages: AppValidationMessagesService) {
        this.cols = [
            { field: 'code', header: 'Modelo' },
            { field: 'type', header: 'Tipo Modelo' },
            { field: 'year', header: 'Año Modelo' },
            { field: 'description', header: 'Descripción' },
            { field: 'action', header: 'Acción' },
        ];
        this.buildForm();
        this.fillTable();
    }
    
    ngOnInit(): void {
        this.onChanges();
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            modelCode: ['', [Validators.required]],
        });
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.searchButtonDisable = (this.formGroup.get("modelCode").value) ? false : true;
        });
    }

    fillTable() {
        this.visible = false;
        this.service.get(true).subscribe((response) => {
            this.models = response;
            this.models = this.models.map(x => ({
                ...x,
                type: x.type.type
            }));
        });
        this.service.get(false).subscribe((response) => {
            this.modelSelects = response.map(r => (
                { label: r.code, value: r }
            ));
            this.modelSelects = this.modelSelects.filter((x) => x.value.type.type === "KK");
        });
    }

    addModel() {
        this.visible = true;
    }

    deleted(value) {
        this.confirmationService.confirm({
            message: '¿Seguro qué desea eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.put({ id: value.id, excluded: false }).subscribe((response) => {
                    this.fillTable();
                });
            },
            reject: () => {

            }
        });
    }
}

