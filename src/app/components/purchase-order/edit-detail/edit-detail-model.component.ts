import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService, SelectItem } from 'primeng/api';
import { Model } from 'src/app/models/model.model';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';


@Component({
    selector: 'edit-detail-model-component',
    templateUrl: './edit-detail-model.component.html',
    styleUrls: ['./edit-detail-model.component.css'],
    providers: [ModelControllerService,ModelColorControllerService,PurchaseOrdenControllerService]
})
export class EditDetailModelComponent implements OnInit {
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    colors: SelectItem[] = [];
    models: SelectItem[] = [];
    addModel: FormGroup = new FormGroup({
        model: new FormControl(),
        plant: new FormControl({disabled:true}),
        modelType: new FormControl({disabled:true}),
        color: new FormControl(),
        internalColor: new FormControl({disabled:true}),
        quantity: new FormControl()
    });
    validations=[];
    @Input() purchaseOrderId;
    @Input() pedido: PurchaseOrderDetail;

    constructor(public messageServices: MessageService,private fb: FormBuilder,private servicesPurchase: PurchaseOrdenControllerService,private serviceColor: ModelColorControllerService,private messages: AppValidationMessagesService, private services: ModelControllerService){
        this.fillModel();
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('model'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('color'));

        this.messages.messagesRequired = 'true';
        this.messages.messagesPattern = 'alfabeticos';
        this.validations.push(this.messages.getValidationMessagesWithName('quantity'));
        this.pedido = {color: {id:0,code:'',interiorCode:''},model: {id:0, code: '',type:{id:0,type:''},plant: {abbreviation: '',id:1,salesCode:''}},quantity:0,purchaseOrderId:0 };
    }
    ngOnInit(): void {
        this.addModel.controls['modelType'].disable();
        this.addModel.controls['plant'].disable();
        this.addModel.controls['internalColor'].disable();
    }
    

    public BuildForm(pedido) {

        let promesa = new Promise((resolved) => {
            this.serviceColor.get(pedido.model.id).subscribe((response) => {
                this.colors = response.map(r => ({
                    label: r.code,
                    value: r
                }));
    
            });
            resolved(true);
        });

        promesa.then((succes) => {
            setTimeout((sc)=>{
                this.addModel = this.fb.group({
                    model: [pedido.model, [Validators.required]],
                    plant:new FormControl({value:pedido.model.plant.abbreviation, disabled:true}),
                    modelType:new FormControl({value:pedido.model.type.type, disabled:true}),
                    color: [pedido.color, [Validators.required]],
                    internalColor: new FormControl({value:pedido.color.interiorCode, disabled:false}),
                    quantity: new FormControl(pedido.quantity, [Validators.required,Validators.pattern('^[0-9]*$')]),
                    id: new FormControl(pedido.id)
                });
            },10);
        })
        
        

    }

    fillModel(){
        this.services.get(true).subscribe((rs) => {
            this.models = rs.map(r => (
                { label: r.code, value: r}
            ))
        })
    }

    fillColor(){
        this.serviceColor.get(this.addModel.get('model').value.id).subscribe((response) => {
            this.colors = response.map(r => ({
                label: r.code,
                value: r
            }));

        });
        
    }
    fillColorId(idModel){
        
        
        


    }

    selectModel():void{
        this.addModel.get('color').reset();
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
        if (this.addModel.valid) {

            let validPromise = new Promise((resolved) => {
                this.servicesPurchase.purchase_orders(this.purchaseOrderId, null, null).subscribe((response) => {
                    let array = response[0].detail;
                    array.forEach(element => {
                        if (element.color.id === this.addModel.value.color.id && element.model.id === this.addModel.value.model.id) {
                            resolved(false)
                            
                        }
                    });
                    resolved(true)
                });
            })
            validPromise.then((rs) => {
                if (true) {
                
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
                            id:this.addModel.get('id').value,
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
                        this.servicesPurchase.putPurchaseOrderDetail(detail).subscribe((response) => {
                            this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
        
                            this.closed();
                        });
        
                    });
    
                }else{
                    this.messageServices.add({key: 'error', severity:'info', summary: 'La combinacion de modelo color ya existe en los pedidos'});

                    
                }
            });
        }
    }

    closed(){
        this.addModel.reset();
        this.close.emit(false);
    }

}

