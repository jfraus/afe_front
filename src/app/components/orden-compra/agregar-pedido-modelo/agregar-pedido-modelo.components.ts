import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { SelectItem } from 'primeng/api';
import { Model } from 'src/app/models/model.model';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';


@Component({
    selector: 'agregar-pedido-modelo',
    templateUrl: './agregar-pedido-modelo.components.html',
    styleUrls: ['./agregar-pedido-modelo.components.css'],
    providers: [ModelControllerService,ModelColorControllerService,PurchaseOrdenControllerService]
})
export class AgregarPedidoModeloComponent {
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    colors: SelectItem[] = [];
    models: SelectItem[] = [];
    addModel: FormGroup;
    validations=[];
    @Input() purchaseOrderId;

    constructor(private fb: FormBuilder,private servicesPurchase: PurchaseOrdenControllerService,private serviceColor: ModelColorControllerService,private messages: AppValidationMessagesService, private services: ModelControllerService){
        this.BuildForm();
        this.fillModel();
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('model'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('color'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('quantity'));
    }

    private BuildForm() {
        this.addModel = this.fb.group({
            model: ['', [Validators.required]],
            plant:new FormControl({value:'', disabled:true}),
            modelType:new FormControl({value:'', disabled:true}),
            color: new FormControl('', Validators.required),
            internalColor: new FormControl({value:'', disabled:true}),
            quantity: new FormControl('', Validators.required)
        });
    }

    fillModel(){
        this.services.get(true).subscribe((rs) => {
            this.models = rs.map(r => (
                { label: r.code, value: r}
            ))
        })
    }

    selectModel():void{
        let model = this.addModel.get('model').value;
        let isSelected = model !== null;
        this.addModel.get('modelType').setValue(isSelected ? model.type.type : '');
        this.addModel.get('plant').setValue(isSelected ? model.plant.salesCode : '');
        this.serviceColor.get(model.id).subscribe((response) => {
            this.colors = response.map(r => ({
                label: r.code,
                value: r
            }));
        })
    }

    selectColor():void{
        let color = this.addModel.get('color').value;
        
        this.addModel.get('internalColor').setValue(color !== null ? color.interiorCode: '');
    }

    agregar(){
        if(this.addModel.valid){

            let promise = new Promise((resolved) => {
                let postObject: Model = {
                    code: this.addModel.value.model.code,
                    color: this.addModel.value.color,
                    description: this.addModel.value.model.description,
                    id: this.addModel.value.model.id,
                    plant: this.addModel.value.model.plant,
                    type: this.addModel.value.model.type
                };
                
                let detail: PurchaseOrderDetail = {
                    purchaseOrderId: this.purchaseOrderId,
                    quantity: this.addModel.get('quantity').value,
                    color: this.addModel.value.color,
                    model: {
                        id: postObject.id
                    }
                };
                resolved(detail);
            });

            promise.then((detail: PurchaseOrderDetail) => {
                this.servicesPurchase.postPurchaseOrderDetail(detail).subscribe((response) => {
                    this.closed();
                })

            })

            
            
            
        }
    }

    closed(){
        this.addModel.reset();
        this.close.emit(false);
    }
}

