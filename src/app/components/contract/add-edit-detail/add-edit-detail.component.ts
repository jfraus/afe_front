import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService, SelectItem } from 'primeng/api';
import { from } from 'rxjs';
import { CarrierControllerService } from 'src/app/services/carrier-controller.service';
import { DealerControllerService } from 'src/app/services/dealer-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { FormatDate } from 'src/app/utils/format-date';
import { CarrierType } from 'src/app/enums/carrier-type.enum';


@Component({
    selector: 'add-edit-detail',
    templateUrl: './add-edit-detail.component.html',
    styleUrls: ['./add-edit-detail.component.css'],
    providers: [CarrierControllerService, AppValidationMessagesService, SaleContractControllerService, ModelColorControllerService, ModelControllerService, DealerControllerService, FormatDate]
})
export class EditAddDetailComponent implements OnInit {

    //ADD
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    model: SelectItem[] = [];
    color: SelectItem[] = [];
    carrierType: SelectItem[] = [];
    carrier: SelectItem[] = [];
    @Input() saleContractId: any;
    addModel: FormGroup;
    validations = [];
    @Input() purchaseOrderId;

    //EDIT
    @Input() edit: boolean;
    modelEdit: FormGroup;
    @Input() detail: any;

    constructor(private serviceCarrier: CarrierControllerService, 
        private messages: AppValidationMessagesService, 
        public serviceModelColor: ModelColorControllerService, 
        public messageServices: MessageService, 
        private utilDate: FormatDate,
        private fb: FormBuilder, 
        private servicesModel: ModelControllerService, 
        private serviceDealer: DealerControllerService, 
        private serviceSale: SaleContractControllerService) {
        
        this.buildForm();
        this.fill();
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('model'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('color'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('carrier'));

        this.messages.messagesRequired = 'true';
        this.messages.messagesMaxLenght = '7';
        this.messages.messagesPattern = 'alfabeticos';
        this.validations.push(this.messages.getValidationMessagesWithName('quantity'));
    }

    ngOnInit(): void {}
    
    fill() {
        for (let cType in CarrierType) {
            this.carrierType.push({label: cType, value:CarrierType[''+cType+'']});
        }
        this.servicesModel.get(true).subscribe((response) => {
            this.model = response.map(r => (
                { label: r.code, value: r }
            ));
        });
    }

    ngOnChanges(changes: SimpleChanges) {

        if(this.detail && this.edit){
            this.addModel.get('model').setValue(this.detail.model);
            this.addModel.get('modelType').setValue(this.detail.model.type.type);
            this.addModel.get('carrierType').setValue(this.detail.carrier.carrierType);
            this.addModel.get('quantity').setValue(this.detail.quantity);
            let promiseModel = new Promise((resolved) => {
                this.serviceModelColor.get(this.detail.model.id).subscribe((response) => {
                    this.color = response.map(r => ({
                        label: r.code, value: r
                    }));
                    resolved(this.detail.color);
                });

            });

            promiseModel.then((succes) => {
                let promiseCarrier = new Promise((resolved) => {
                    this.serviceCarrier.get(this.detail.carrier.carrierType).subscribe((response) => {
                        this.carrier = response.map(r => ({
                            label: r.carrierCode, value: r
                        }));
                        resolved(true);
                    });
                });

                promiseCarrier.then((sc) => {
                    setTimeout(() => {
                        this.addModel.get('color').setValue(this.detail.color);
                        this.addModel.get('colorInterior').setValue(this.detail.color.interiorCode);
                        this.addModel.get('carrier').setValue(this.detail.carrier);
                        this.addModel.get('carrierName').setValue(this.detail.carrierName);
                    }, 500);
                })
            });
        }
        if (changes.detail) {
            if (changes.detail.currentValue) {
                this.addModel.get('model').setValue(this.detail.model);
                this.addModel.get('modelType').setValue(this.detail.model.type.type);
                this.addModel.get('carrierType').setValue(this.detail.carrier.carrierType);
                this.addModel.get('quantity').setValue(this.detail.quantity);
                let promiseModel = new Promise((resolved) => {
                    this.serviceModelColor.get(this.detail.model.id).subscribe((response) => {
                        this.color = response.map(r => ({
                            label: r.code, value: r
                        }));
                        resolved(this.detail.color);
                    });

                });

                promiseModel.then((succes) => {
                    let promiseCarrier = new Promise((resolved) => {
                        this.serviceCarrier.get(this.detail.carrier.carrierType).subscribe((response) => {
                            this.carrier = response.map(r => ({
                                label: r.carrierCode, value: r
                            }));
                            resolved(true);
                        });
                    });

                    promiseCarrier.then((sc) => {
                        setTimeout(() => {
                            this.addModel.get('color').setValue(this.detail.color);
                            this.addModel.get('colorInterior').setValue(this.detail.color.interiorCode);
                            this.addModel.get('carrier').setValue(this.detail.carrier);
                            this.addModel.get('carrierName').setValue(this.detail.carrierName);
                        }, 10);
                    })
                });
            }
        }

    }

    updateDetail() {
        if (this.addModel.valid) {
            this.serviceSale.putDetail({
                carrier: {
                    id: this.addModel.get('carrier').value.id
                },
                color: {
                    id: this.addModel.get('color').value.id
                },
                model: {
                    id: this.addModel.get('model').value.id
                },
                id: this.detail.id,
                quantity: this.addModel.get('quantity').value,
                saleContractId: this.saleContractId
            }).subscribe((response) => {
                this.messageServices.add({ key: 'success', severity: 'success', summary: 'Actualizado con éxito' });
                this.closedRefresh();
            });
        }
    }

    private buildForm() {
        this.addModel = this.fb.group({
            model: ['', [Validators.required]],
            color: ['', [Validators.required]],
            quantity: ['', [Validators.required, Validators.maxLength(7), Validators.pattern('^[0-9]*$')]],
            carrierType: ['', [Validators.required]],
            carrier: ['', [Validators.required]],
            colorInterior: new FormControl({ value: '', disabled: true }),
            modelType: new FormControl({ value: '', disabled: true }),
            contractNumber : new FormControl({ value: '', disabled: true }),
            carrierName: new FormControl({ value: '', disabled: true }),
            totalUnitsAssigned: new FormControl({ value: 0, disabled: true }),

        });
    }

    selectTCarrier() {
        let type = this.addModel.get('carrierType').value;
        this.serviceCarrier.get(type).subscribe((response) => {
            this.carrier = response.map(r => ({
                label: r.carrierCode, value: r
            }));
        });
        this.addModel.get('carrierName').setValue('');
    }

    selectCarrier() {
        let carrier = this.addModel.get('carrier').value;
        this.addModel.get('carrierName').setValue(carrier !== null ? carrier.name : '');
    }

    selectModel() {
        let model;
        let promise = new Promise((resolved) => {
            model = this.addModel.get('model').value;
            let isSelected = model !== null;
            this.addModel.get('modelType').setValue(isSelected ? model.type.type : '');
            this.addModel.get('color').setValue('');
            this.addModel.get('colorInterior').setValue('');
            resolved(true);
        });

        promise.then((success) => {
            if (this.addModel.get('model').value) {
                this.serviceModelColor.get(model.id).subscribe((response) => {
                    this.color = response.map(r => ({
                        label: r.code, value: r
                    }))
                });
            }
        });
    }

    selectColor(): void {
        let color = this.addModel.get('color').value;
        this.addModel.get('colorInterior').setValue(color !== null ? color.interiorCode : '');
    }

    add() {
        if (this.addModel.valid) {
            let validPromise = new Promise((resolved) => {
                this.serviceSale.get(null, null, null, this.saleContractId).subscribe((response) => {
                    let array = response[0].detail;
                    if(array){
                        array.forEach(element => {
                            if (element.color.id === this.addModel.value.color.id && element.model.id === this.addModel.value.model.id) {
                                resolved(false)
                            }
                        });
                    }
                    resolved(true)
                });
            });
                validPromise.then((rs) => {
                    if (rs) {
                        this.serviceSale.postCreateDetail({
                            carrier: {
                                id: this.addModel.get('carrier').value.id
                            },
                            color: {
                                id: this.addModel.get('color').value.id
                            },
                            model: {
                                id: this.addModel.get('model').value.id
                            },
                            quantity: this.addModel.get('quantity').value,
                            saleContractId: this.saleContractId,
                            totalUnitsAssigned: 0
                        }).subscribe((response) => {
                            this.messageServices.add({ key: 'success', severity: 'success', summary: 'Guardado con éxito' });
                            this.closedRefresh();
                        });
                }
            });
        }
    }

    closed() {
        this.addModel.reset();
        this.color = [];
        this.carrier = [];
        this.close.emit(false);
    }

    closedRefresh(){
        this.addModel.reset();
        this.color = [];
        this.carrier = [];
        this.close.emit(true);
    }
}

