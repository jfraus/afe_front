import { EventEmitter, ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { EditarPedidoModeloComponent } from '../editar-pedido/editar-pedido.component';
@Component({
    selector: 'editar-orden_compra',
    templateUrl: './editar-orden-compra.component.html',
    styleUrls: ['./editar-orden-compra.component.css'],
    providers: [PurchaseOrdenControllerService,ConfirmationService]
})
export class EditarOrdenCompraComponent implements OnInit {
    @ViewChild(EditarPedidoModeloComponent, {static: true}) editarComponent: EditarPedidoModeloComponent;

    purchaseOrder = [];

    @Input() order: any;
    @Input() productionMonth = new Date();
    @Input() fechaVencimiento = new Date();
    @Output() close = new EventEmitter();
    pedido: PurchaseOrderDetail;
    displayAdd: boolean;
    displayEdit: boolean;
    loadingPurchaseOrder = true;
    cols = [];
    validations = [];
    formGroup = new FormGroup({
        productionMonthForm: new FormControl(),
        fechaVencimiento: new FormControl(),
        orderCode:new  FormControl()
    });
    fechaVencimientoName = "fechaVencimiento";
    productionMonthFormName = 'productionMonthForm';
    searchButtonDisable = false;
    minDate = new Date();
    minVencimiento = new Date();

    constructor(public confirmationService: ConfirmationService,public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService) {

        let day = new Date();
        this.minDate = new Date(day.getFullYear(),day.getMonth() ,1,0,0,0,0);
        this.minVencimiento = new Date(day.getFullYear(),day.getMonth() -1,1,0,0,0,0);

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

    }
    closedEditarPedido(){
        this.displayEdit = false;
        this.fillTable();
    }
    fillTable(){
        this.loadingPurchaseOrder = true;
        this.service.purchase_orders(this.order.id,null,null).subscribe((response) =>
        {
            this.loadingPurchaseOrder = false;
            this.order.detail = response[0].detail;
        });
    }
    closedAgregar(){
        this.displayAdd = false;
        this.fillTable();
    }

    private BuildForm() {
        this.formGroup = this.fb.group({
            productionMonthForm: [this.productionMonth, [Validators.required]],
            fechaVencimiento: [(this.fechaVencimiento.getDate())? this.fechaVencimiento: null, [Validators.required]],
            orderCode:[this.order.orderNumber, []],
            unitsQuantity: [this.order.unitsQuantity,[]]
        });
        this.formGroup.controls['orderCode'].disable();
        this.formGroup.controls['unitsQuantity'].disable();
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
    add(){
        this.displayAdd =  true;
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



    visible: boolean = true;
    ngOnInit(): void {
        this.BuildForm();
    }


    Save(){
        if(this.formGroup.valid){
            let promise = new Promise((resolved, reject) => {
                let dateVencida = new Date(this.formGroup.get('fechaVencimiento').value);
                let dateProduction = new Date(this.formGroup.get('productionMonthForm').value);
                this.order.dueDate = dateVencida.getTime();
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

    Close(){
        this.close.emit(true);
    }

}

