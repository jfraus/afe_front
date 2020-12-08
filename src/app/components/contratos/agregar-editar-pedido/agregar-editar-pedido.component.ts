import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService, SelectItem } from 'primeng/api';
import { Model } from 'src/app/models/model.model';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { CarrierControllerService } from 'src/app/services/carrier-controller.service';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { DealerControllerService } from 'src/app/services/dealer-controller.service';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { FormatDate } from 'src/app/utils/format-date';


@Component({
    selector: 'editar-agregar-pedido',
    templateUrl: './agregar-editar-pedido.component.html',
    styleUrls: ['./agregar-editar-pedido.component.css'],
    providers: [CarrierControllerService, AppValidationMessagesService, SaleContractControllerService, ModelColorControllerService, ModelControllerService, DealerControllerService, FormatDate]
})
export class EditarAgregarPedidoComponent implements OnInit {

    //AGREGAR
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    model: SelectItem[] = [];
    color: SelectItem[] = [];
    tipocarrier: SelectItem[] = [];
    carrier: SelectItem[] = [];
    @Input() saleContractId: any;
    addModel: FormGroup;
    validations = [];
    @Input() purchaseOrderId;

    //EDITAR
    @Input() editar: boolean;
    modelEditar: FormGroup;
    @Input() detail: any;




    constructor(private serviceCarrier: CarrierControllerService, private messages: AppValidationMessagesService, public serviceModelColor: ModelColorControllerService, public messageServices: MessageService, private utilDate: FormatDate, private fb: FormBuilder, private servicesModel: ModelControllerService, private serviceDealer: DealerControllerService, private serviceSale: SaleContractControllerService) {


        // AGREGAR
        this.buildForm();
        this.fill();

        this.tipocarrier = [{ label: 'Madrina', value: 'T' }, { label: 'Oceano', value: 'O' }, { label: 'Rail', value: 'R' }];

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('model'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('color'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('carrier'));

        this.messages.messagesRequired = 'true';
        this.messages.messagesMaxLenght = '7';
        this.messages.messagesPattern = 'alfabeticos';
        this.validations.push(this.messages.getValidationMessagesWithName('cantidad'));




    }
    ngOnInit(): void {
    }



    ngOnChanges(changes: SimpleChanges) {
        if (changes.detail) {
            if (changes.detail.currentValue) {
                this.addModel.get('model').setValue(this.detail.model);
                this.addModel.get('tipoModelo').setValue(this.detail.model.type.type);

                this.addModel.get('tipocarrier').setValue(this.detail.carrier.carrierType);
                this.addModel.get('cantidad').setValue(this.detail.quantity);



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
                            this.addModel.get('nombrecarrier').setValue(this.detail.carrierName);
                        }, 500);
                    })
                });
            }
        }
    }

    actualizarDetail() {
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
                quantity: this.addModel.get('cantidad').value,
                saleContractId: this.saleContractId
            }).subscribe((response) => {
                this.messageServices.add({ key: 'error', severity: 'success', summary: 'Actualizado con exito' });
                this.closed();
            });
        }
    }



    private buildForm() {
        this.addModel = this.fb.group({
            model: ['', [Validators.required]],
            color: ['', [Validators.required]],
            cantidad: ['', [Validators.required, Validators.maxLength(7), Validators.pattern('^[0-9]*$')]],
            tipocarrier: ['', [Validators.required]],
            carrier: ['', [Validators.required]],
            colorInterior: new FormControl({ value: '', disabled: true }),
            tipoModelo: new FormControl({ value: '', disabled: true }),
            contratoVenta: new FormControl({ value: '', disabled: true }),
            nombrecarrier: new FormControl({ value: '', disabled: true }),
        });
    }

    selectTCarrier() {

        let tipo = this.addModel.get('tipocarrier').value;
        this.serviceCarrier.get(tipo).subscribe((response) => {
            this.carrier = response.map(r => ({
                label: r.carrierCode, value: r
            }));
        });


    }

    selectCarrier() {
        let carrier = this.addModel.get('carrier').value;
        this.addModel.get('nombrecarrier').setValue(carrier !== null ? carrier.name : '');
    }


    fill() {
        this.servicesModel.get(true).subscribe((response) => {

            this.model = response.map(r => (
                { label: r.code, value: r }
            ));
            this.model = this.model.filter(x => x.value.type.type == 'KK');

        });

    }



    selectModel() {
        let model;
        let promise = new Promise((resolved) => {
            model = this.addModel.get('model').value;
            let isSelected = model !== null;
            this.addModel.get('tipoModelo').setValue(isSelected ? model.type.type : '');
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

    agregar() {
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
                            quantity: this.addModel.get('cantidad').value,
                            saleContractId: this.saleContractId
                        }).subscribe((response) => {
                            this.messageServices.add({ key: 'success', severity: 'success', summary: 'Guardado con éxito' });
                            this.closed();
                        });
                }else{
                    this.messageServices.add({key: 'error', severity:'info', summary: 'La combinación Modelo-Color ya existen en el Contrato de Venta.'});

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
}

