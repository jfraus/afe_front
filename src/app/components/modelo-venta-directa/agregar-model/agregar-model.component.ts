import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
    selector: 'agregar-model-component',
    templateUrl: './agregar-model.component.html',
    styleUrls: ['./agregar-model.component.css'],
    providers: [ModelControllerService, ConfirmationService]
})
export class AgregarModelComponent {
    formGroup: FormGroup;
    @Output() close = new EventEmitter();
    addDisable = true;
    @Input() model = [];
    modelSelected: any;
    @Input() display: boolean;
    cols = [];
    validations = [];
    constructor(private service: ModelControllerService, public confirmationService: ConfirmationService, public messageServices: MessageService, private fb: FormBuilder, private messages: AppValidationMessagesService) {
        this.cols = [
            { field: 'code', header: 'Modelo' },
            { field: 'type', header: 'Tipo Modelo' },
            { field: 'year', header: 'Año Modelo' },
            { field: 'description', header: 'Descripción' },
            { field: 'action', header: 'Acción' },
        ];
        this.BuildForm();
    }
    private BuildForm() {
        this.formGroup = this.fb.group({
            model: ['', [Validators.required]],
            plant: new FormControl({ value: '', disabled: true }),
            type: new FormControl({ value: '', disabled: true }),
            year: new FormControl({ value: '', disabled: true }),
            description: new FormControl({ value: '', disabled: true }),
        });
    }

    closed() {
        this.formGroup.reset();
        this.close.emit(true);
        this.addDisable = true;
    }
    fillSelect() {
        this.service.get(false).subscribe((response) => {
            this.model = response.map(r => (
                { label: r.code, value: r }
            ))

        });
    }

    selectedChange(e) {
        if (e.value) {
            this.addDisable = false;
            this.formGroup.get('plant').setValue(e.value.plant.salesCode);
            this.formGroup.get('description').setValue(e.value.description);
            this.formGroup.get('type').setValue(e.value.type.type);
            this.formGroup.get('year').setValue(e.value.year);
            this.modelSelected = e.value;
        } else {
            this.addDisable = true;
            this.formGroup.get('plant').reset();
            this.formGroup.get('description').reset();
            this.formGroup.get('type').reset();
            this.formGroup.get('year').reset();

        }
    }

    add() {
        this.service.put({ id: this.modelSelected.id, excluded: true }).subscribe((response) => {
            this.closed();
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Guardado con exito' });
        })
    }

}
