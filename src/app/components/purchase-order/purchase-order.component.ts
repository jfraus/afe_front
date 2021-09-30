import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { FormatDate } from "src/app/utils/format-date";
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { ignoreElements } from "rxjs/operators";

@Component({
    selector: 'purchase-order-component',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.css'],
    providers: [PurchaseOrdenControllerService, ConfirmationService, ModelControllerService, ModelColorControllerService]
})
export class PurchaseOrderComponent implements OnInit {

    purchaseOrder = [];
    loadingPurchaseOrder = true;
    cols = [];
    validations = [];
    formGroup: FormGroup;
    orderCodeName = "orderCode";
    mounthProduction = 'mounthProduction';
    order: any;
    searchButtonDisable = false;
    visibledetails: boolean = true;
    visibleEditable = false;
    fechaProductionMonthSelected = new Date();
    fechaVencimientoSelected = new Date();
    visible: boolean = true;
    types = [];
    models = [];
    colors = [];    
    eneblePurchaseOrder = true;
    enableProductionDate = true;
    enableType = true;
    enableModel = true;
    enableColor = true;

    constructor(public dateUtil: FormatDate, public confirmationService: ConfirmationService, public messageServices: MessageService, 
        private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService,
        private modelControllerService: ModelControllerService, private modelColorService: ModelColorControllerService) {

        this.TableOrderFull();
        this.BuildForm();
        this.cols = [
            { field: 'orderNumber', header: 'Orden de Compra' },
            { field: 'productionMonth', header: 'Mes de Produción' },
            { field: 'dueDate', header: 'Fecha de Vencimiento' },
            { field: 'unitsQuantity', header: 'Total Pedido' },
            { field: 'unitsAssigned', header: 'Total Asignado' },
            { field: 'status', header: 'Estatus' },
            { field: 'action', header: 'Acción' },
        ];

        this.messages.messagesRequired = 'true';
        this.messages.messagesMaxLenght = '7';
        this.messages.messagesMinLenght = '7';
        this.validations.push(this.messages.getValidationMessagesWithName('orderCode'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('mounthProduction'));
    }
    
    ngOnInit(): void {
        this.onChanges();
        this.loadType();
    }

    selectedChangeType(e) {
        if(e.value){
            this.formGroup.controls['orderCode'].disable();
            this.formGroup.controls['mounthProduction'].disable();
            this.loadModel(e.value);
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
        }else{
            this.formGroup.get('model').reset();
            this.formGroup.get('color').reset();
            this.models = [];
            this.colors = [];
            this.formGroup.controls['orderCode'].enable();
            this.formGroup.controls['mounthProduction'].enable();
        }
    }

    selectedChangeModel(e){
        if(e.value){
            this.loadColor(e.value);
        }else{
            this.formGroup.get('color').reset();
            this.colors = [];
        }
    }

    selectedChangeOrderCode(e){
        let x = this.formGroup.get('orderCode').value;
        if(x.length>0) {
            this.formGroup.controls['mounthProduction'].disable();
            this.formGroup.controls['model'].disable();
            this.formGroup.controls['color'].disable();
            this.formGroup.controls['type'].disable();
        }else{
            this.formGroup.controls['mounthProduction'].enable();
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
            this.formGroup.controls['type'].enable();           
      }
    }

    selectedChangeMountProdc(e){
        let x = this.formGroup.get('mounthProduction').value;
        console.log("tiene de valor:"+x);
        if(x != null){            
            this.formGroup.controls['orderCode'].disable();
            this.formGroup.controls['model'].disable();
            this.formGroup.controls['color'].disable();
            this.formGroup.controls['type'].disable();
        }else{
            this.formGroup.controls['orderCode'].enable();
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
            this.formGroup.controls['type'].enable();
        }  
    }

    private loadType() : void {
        this.types =[
            { label: 'KA', value: 'KA'  } ,
            { label: 'KC', value: 'KC' } ,
            { label: 'KK', value: 'KK' }
         ];
    }

    private loadModel(modelType: String) : void {
        this.modelControllerService.getModelsByType(modelType).subscribe(data =>{
            this.models = data.map(r => (       
                { label: r.code , value: r.id}
              ));
        });
    }

    private loadColor(model: string) : void {
        this.modelColorService.get(model).subscribe(data =>{
            this.colors = data.map(r => ( 
                { label: r.code , value: r.id}
            )); 
        });        
    }

    private BuildForm() {
        this.formGroup = this.fb.group({
            orderCode: ['', [Validators.maxLength(7), Validators.minLength(7)]],
            mounthProduction: ['', []],
            model: new FormControl({ value: '', disabled: true }),
            color: new FormControl({ value: '', disabled: true }),
            type: ['', []]
        });
    }

    TableOrderFull() {
        this.service.purchase_orders(null, null, null).subscribe((response) => {
            this.purchaseOrder = response;
            this.purchaseOrder = this.purchaseOrder.map(iteam => ({
                ...iteam,
                dueDate: this.dateUtil.formatDateWithoutTime(iteam.dueDate)
            }))
            this.loadingPurchaseOrder = false;
        });
    }

    NewOc() {
        this.visible = false;
        this.visibledetails = true;
        this.visibleEditable = true;
    }

    SearchPurchaseOrder() {
        this, this.messageServices.clear();
        if (this.formGroup.get('mounthProduction').value) {
            let fecha = new Date(this.formGroup.get('mounthProduction').value);
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, this.formGroup.get('orderCode').value, `${fecha.getFullYear()}${fecha.getMonth() + 1}`).subscribe((response) => {
                if (response.length > 0) {
                    this.purchaseOrder = response;
                } else {
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.purchaseOrder = [];
                }
                this.loadingPurchaseOrder = false;
                this.formGroup.get('orderCode').reset();
                this.formGroup.get('mounthProduction').reset();
            });
        } else {
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, this.formGroup.get('orderCode').value, null).subscribe((response) => {
                if (response.length > 0) {
                    this.purchaseOrder = response;
                } else {
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.purchaseOrder = [];
                }
                this.loadingPurchaseOrder = false;
                this.formGroup.get('orderCode').reset();
                this.formGroup.get('mounthProduction').reset();
            });
        }
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.searchButtonDisable = ((this.formGroup.get(this.orderCodeName).value && this.formGroup.get(this.orderCodeName).valid) 
            || this.formGroup.get(this.mounthProduction).value || (this.formGroup.get('type').value && this.formGroup.get('model').value && this.formGroup.get('color').value))
            ? true : false;
        });
    }

    ShowDetails(detail) {
        this.service.purchase_orders(detail.id, null, null).subscribe((response) => {
            this.order = response[0];
            this.fechaVencimientoSelected = new Date(response[0].dueDate);
            if (response[0].productionMonth) {
                this.fechaProductionMonthSelected = new Date(response[0].productionMonth.substring(0, 4), response[0].productionMonth.substring(4, 6), -30, 0, 0, 0, 0);
            }
            this.visible = false;
            this.visibledetails = false;
            this.visibleEditable = true;
        });
    }

    CloseDetails() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
    }

    sendOC(oc) {
        let check = false;
        this.service.purchase_orders(oc.id, null, null).subscribe((response) => {
            if (response[0].detail.length > 0) {
                this.confirmationService.confirm({
                    message: 'Deseas enviar OC, una vez enviada no se podrá editar.',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.service.enviarPurchaseOrder(oc.id).subscribe((response) => {
                            this.TableOrderFull();
                            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Se ha enviado el registro' });
                        });
                    },
                    reject: () => {

                    }
                });
            } else {
                this.messageServices.add({ key: 'error', severity: 'info', summary: 'La orden de compra no tiene pedidos' });
            }
        });
    }

    EditOrden(purchaseOrder) {
        this.service.purchase_orders(purchaseOrder.id, null, null).subscribe((response) => {
            this.order = response[0];
            this.fechaVencimientoSelected = new Date(response[0].dueDate);
            if (response[0].productionMonth) {
                this.fechaProductionMonthSelected = new Date(response[0].productionMonth.substring(0, 4), response[0].productionMonth.substring(4, 6), 0, 0, 0, 0, 0);
            }
            this.visible = false;
            this.visibledetails = true;
            this.visibleEditable = false;
        });
    }

    CloseEditar() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.TableOrderFull();
    }

    closeGenerar() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.TableOrderFull();
    }

    sendAssignment(): void {
        this.service.sendAssignment().subscribe((response) => {
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Enviado!' });
        });
    }

}

