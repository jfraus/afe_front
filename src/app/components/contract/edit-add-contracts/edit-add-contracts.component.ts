import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService, SelectItem } from 'primeng/api';
import { Model } from 'src/app/models/model.model';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
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
    selector: 'edit-add-contracts-component',
    templateUrl: './edit-add-contracts.component.html',
    styleUrls: ['./edit-add-contracts.component.css'],
    providers: [AppValidationMessagesService,SaleContractControllerService,DistributionControllerService,CountryControllerService,DealerControllerService,FormatDate]
})
export class EditAddContractComponent {
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    dealer: SelectItem[] = [];
    country: SelectItem[] = [];
    addModel: FormGroup;
    validations=[];
    @Input() purchaseOrderId;

    constructor(private messages: AppValidationMessagesService,public serviceDistribution: DistributionControllerService,public messageServices: MessageService,private utilDate: FormatDate,private fb: FormBuilder,private servicesCountry: CountryControllerService, private serviceDealer: DealerControllerService, private serviceSale: SaleContractControllerService){
        this.buildForm();
        this.fillCountry();


        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('country'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('dealer'));

    }

    private buildForm() {
        this.addModel = this.fb.group({
            country: ['', [Validators.required]],
            dealer: new FormControl('', Validators.required),
            nameDealer:new FormControl({value:'', disabled:true}),
            codpais:new FormControl({value:'', disabled:true}),
            port:new FormControl({value:'', disabled:true}),
            contractNumber: new FormControl({value:'', disabled:true}),
            createdDate: new FormControl({value: this.utilDate.formatDate(new Date()), disabled:true}),
        });
    }

   
    fillCountry(){
        this.serviceDealer.get().subscribe((response) => {
            this.dealer = response.map(r => (
                { label: r.number, value: r}
            ));
            
        })
        this.servicesCountry.get().subscribe((response) => {
            this.country = response.map(r => (
                { label: r.name, value: r}
            ));
            
            
        })
    }

    

    selectModel(){
        let pais;
        let promise = new Promise((resolved) => {
            pais = this.addModel.get('country').value;
            let isSelected = pais !== null;
            this.addModel.get('codpais').setValue(isSelected ? pais.countryCode : '');
            resolved(true);
        });

        promise.then((success) => {
            if(this.addModel.get('dealer').value){
                this.serviceDistribution.get(pais.id,this.addModel.get('dealer').value.id).subscribe((response) => {
                    this.addModel.get('port').setValue(response.port);
                });
            }

        });
    }

    selectDealer(){
        let dealer;
        let promise = new Promise((resolved) => {
            dealer = this.addModel.get('dealer').value;        
            let isSelected = dealer !== null;
            this.addModel.get('nameDealer').setValue(isSelected ? dealer.name : '');
            resolved(true);
        });

        promise.then((success) => {
            if(this.addModel.get('country').value){
                this.serviceDistribution.get(dealer.id,this.addModel.get('country').value.id).subscribe((response) => {
                    this.addModel.get('port').setValue(response.port);
                });
            }
        });
    }

    

    selectColor():void{
        let color = this.addModel.get('color').value;
        
        this.addModel.get('internalColor').setValue(color !== null ? color.interiorCode: '');
    }

    add(){
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

