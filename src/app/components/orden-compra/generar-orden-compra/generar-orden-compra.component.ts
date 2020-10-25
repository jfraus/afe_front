import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
    selector: 'generar_orden_compra',
    templateUrl: './generar-orden-compra.component.html',
    styleUrls: ['./generar-orden-compra.component.css'],
    providers:[PurchaseOrdenControllerService]
})
export class GenerarOrdenCompraComponent implements OnInit {
   
    purchaseOrderDetail=[];
    loadingPurchaseOrderDetail=true;
    cols=[];
    formGroup = new FormGroup({
        productionMonthForm: new FormControl(),
        fechaVencimiento: new FormControl(),
        orderCode:new  FormControl(),
        unitsQuantity: new FormControl()
    });
    fechaVencimientoName = "fechaVencimiento";
    productionMonthFormName = 'productionMonthForm';
    searchButtonDisable = false;
    minDate = new Date();
    validations = [];
    displayAdd: boolean;

    constructor(public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService){
        let day = new Date();
        this.minDate = new Date(day.getFullYear(),day.getMonth() ,1,0,0,0,0);
        
        this.cols = [
            { field: 'model.type.type', header: 'Tipo' },
            { field: 'model.code', header: 'Modelo' },
            { field: 'color.code', header: 'Color' },
            { field: 'color.interiorCode', header: 'Color interior' },
            { field: 'quantity', header: 'Canitdad' },
        ];
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('productionMonthForm'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('fechaVencimiento'));
        
        this.service.PostFirstPurchaseOrders().subscribe((response) => {
            console.log(response);
            this.formGroup.get('orderCode').setValue(response.orderNumber);
            this.formGroup.get('unitsQuantity').setValue(response.unitsQuantity);
            
        })
    }
    ngOnInit(): void {}

    add(){
        this.displayAdd =  true;         
    }
    private BuildForm() {
        this.formGroup = this.fb.group({
            productionMonthForm: ['', [Validators.required]],
            fechaVencimiento: ['', [Validators.required]],
            orderCode:['', []],
            unitsQuantity: ['',[]]
        });
        this.formGroup.controls['orderCode'].disable();
        this.formGroup.controls['unitsQuantity'].disable();

    }

    salir(){     
    }
}

