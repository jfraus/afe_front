import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { resolve } from 'url';
import { EditarPedidoModeloComponent } from '../editar-pedido/editar-pedido.component';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'generar_orden_compra',
    templateUrl: './generar-orden-compra.component.html',
    styleUrls: ['./generar-orden-compra.component.css'],
    providers:[PurchaseOrdenControllerService,ConfirmationService]
})
export class GenerarOrdenCompraComponent implements OnInit {
    @ViewChild(EditarPedidoModeloComponent, {static: true}) editarComponent: EditarPedidoModeloComponent;

    purchaseOrderDetail=[];
    loadingPurchaseOrderDetail=false;
    cols=[];
    @Output() close = new EventEmitter();
    pedido: PurchaseOrderDetail;

    validadoPost= true;
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
    minVencimiento = new Date();
    validations = [];
    order: PurchaseOrder = {id: 0,orderNumber:'',productionMonth:'',unitsQuantity:1,dueDate: 1};
    displayAdd: boolean;
    displayEdit: boolean;

    constructor(public confirmationService: ConfirmationService,public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService){
        let day = new Date();
        this.minDate = new Date(day.getFullYear(),day.getMonth() ,1,0,0,0,0);
        this.minVencimiento = new Date(day.getFullYear(),day.getMonth() -1,1,0,0,0,0);
        
        this.BuildForm();
        this.cols = [
            { field: 'model.type.type', header: 'Tipo' },
            { field: 'model.code', header: 'Modelo' },
            { field: 'color.code', header: 'Color' },
            { field: 'color.interiorCode', header: 'Color interior' },
            { field: 'quantity', header: 'Cantidad' },
            { field: 'action', header: 'Acción' },
        ];
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('productionMonthForm'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('fechaVencimiento'));
        
        this.service.PostFirstPurchaseOrders().subscribe((response) => {
            this.formGroup.get('orderCode').setValue(response.orderNumber);
            this.formGroup.get('unitsQuantity').setValue(response.unitsQuantity);
            this.order.id = response.id;
            
        })
    }

    fillTable(){
        this.loadingPurchaseOrderDetail = true;
        this.service.purchase_orders(this.order.id,null,null).subscribe((response) =>
        {
            this.loadingPurchaseOrderDetail = false;
            this.purchaseOrderDetail = response[0].detail;
        });
    }

    ngOnInit(): void {
        this.onChanges();
    }

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
        this.formGroup.get('orderCode').disable();
        this.formGroup.get('unitsQuantity').disable();

    }

    salir(){     
        this.close.emit(true);
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.validadoPost = (this.formGroup.get('fechaVencimiento').value && this.formGroup.get('productionMonthForm').valid) ? true : false;
        });
    }

    closedAgregar(){
        this.displayAdd = false;
        this.fillTable();
    }

    eliminarDetail(detail){
        
        this.confirmationService.confirm({
            message: '¿Seguro qué desea eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.deletedPurchaseOrderDetail(detail.id).subscribe((response) => {
                    this.fillTable();
                });
            },
            reject: () => {
                
            }
        });
    
    }

    editarDetail(detail){
        let promise = new Promise((resolve) => {
            this.pedido = {
                id: detail.id,
                color: detail.color,
                model: detail.model,
                quantity: detail.quantity
            }
            resolve(this.pedido);
        });
        
        promise.then((detail) => {
            let promiseForm = new Promise((resolve) => {
            this.editarComponent.BuildForm(this.pedido);
            resolve(true);
            });

            promiseForm.then((succes) => {
                this.editarComponent.fillColor();
                this.displayEdit = true;
            })
            
        });
        
    }
    
    closedEditarPedido(){
        this.displayEdit = false;
        this.fillTable();
    }
    update(){
        if(this.formGroup.valid){
            let promise = new Promise((resolved, reject) => {
                let dateVencida = new Date(this.formGroup.get('fechaVencimiento').value);
                let dateProduction = new Date(this.formGroup.get('productionMonthForm').value);
                this.order.dueDate = dateVencida.getTime();
                this.order.orderNumber = this.formGroup.get('orderCode').value;
                this.order.productionMonth = `${dateProduction.getFullYear()}${dateProduction.getMonth()+1}`;
                resolved(this.order);
            });

            promise.then((succes) => {
                this.service.PutPurchaseOrders(succes).subscribe((response) => {
                    this.messageServices.clear();
                    this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con exito'});
                });
            });
        }
    }
}

