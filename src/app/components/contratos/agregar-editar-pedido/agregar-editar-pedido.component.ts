import { Component, EventEmitter, Input, Output } from "@angular/core";
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
    providers: [CarrierControllerService,AppValidationMessagesService,SaleContractControllerService,ModelColorControllerService,ModelControllerService,DealerControllerService,FormatDate]
})
export class EditarAgregarPedidoComponent {
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    color: SelectItem[] = [];
    model: SelectItem[] = [];
    tipocarrier: SelectItem[] = [];

    addModel: FormGroup;
    validations=[];
    @Input() purchaseOrderId;

    constructor(private serviceCarrier: CarrierControllerService,private messages: AppValidationMessagesService,public serviceModelColor: ModelColorControllerService,public messageServices: MessageService,private utilDate: FormatDate,private fb: FormBuilder,private servicesModel: ModelControllerService, private serviceDealer: DealerControllerService, private serviceSale: SaleContractControllerService){
        this.buildForm();
        this.fillCountry();

        this.tipocarrier = [{label: 'Madrina',value: 'T'},{label: 'Oceano',value: 'O'},{label: 'Rail',value: 'R'}];

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('country'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('dealer'));

    }

    private buildForm() {
        this.addModel = this.fb.group({
            model: ['', [Validators.required]],
            color: new FormControl('', Validators.required),
            colorInterior:new FormControl({value:'', disabled:true}),
            tipoModelo:new FormControl({value:'', disabled:true}),
            puerto:new FormControl({value:'', disabled:true}),
            contratoVenta: new FormControl({value:'', disabled:true}),
            fechaCreacion: new FormControl({value: this.utilDate.formatDate(new Date()), disabled:true}),
            nombrecarrier: new FormControl({value:'', disabled:true}),
            carrier: new FormControl({value:'', disabled:true}),
            tipocarrier: new FormControl({value:'', disabled:false}),
        });
    }

    selectCarrier(){

        let tipo = this.addModel.get('tipocarrier').value;
        this.serviceCarrier.get(tipo).subscribe((response) => {
            console.log(response);
        });
        

    }

   
    fillCountry(){
        this.servicesModel.get(true).subscribe((response) => {
            this.model = response.map(r => (
                { label: r.code, value: r}
            ));
        });

    }

    

    selectModel(){
        let model;
        let promise = new Promise((resolved) => {
            model = this.addModel.get('model').value;        
            let isSelected = model !== null;
            this.addModel.get('tipoModelo').setValue(isSelected ? model.code : '');
            resolved(true);
        });

        promise.then((success) => {
            if(this.addModel.get('model').value){
                this.serviceModelColor.get(model.id).subscribe((response) => {
                    this.color = response.map(r => ({
                        label: r.code, value: r
                    }))
                });
            }
        });
    }

    

    selectColor():void{
        let color = this.addModel.get('color').value;
        
        this.addModel.get('colorInterior').setValue(color !== null ? color.interiorCode: '');
    }

    agregar(){
        if(this.addModel.valid){
            this.serviceSale.post(this.addModel.value).subscribe((response) => {
                this.messageServices.add({key: 'error', severity:'success', summary: 'Guardado con exito'});
                this.closed();
            });
        }
    }

    closed(){
        this.addModel.reset();
        this.close.emit(false);
    }
}

