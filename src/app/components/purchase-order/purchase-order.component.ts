import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { FormatDate } from "src/app/utils/format-date";
@Component({
    selector: 'purchase-order-component',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.css'],
    providers: [PurchaseOrdenControllerService,ConfirmationService]
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

    constructor(public dateUtil: FormatDate,public confirmationService: ConfirmationService,public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService) {
        this.TableOrderFull();
        this.BuildForm();
        this.cols = [
            { field: 'orderNumber', header: 'Orden de Compra' },
            { field: 'productionMonth', header: 'Mes de Produción' },
            { field: 'dueDate', header: 'Fecha de Vencimiento' },
            { field: 'unitsQuantity', header: 'Total unidades' },
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

    private BuildForm() {
        this.formGroup = this.fb.group({
            orderCode: ['', [Validators.maxLength(7), Validators.minLength(7)]],
            mounthProduction: ['', []]
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

    visible: boolean = true;
    ngOnInit(): void {
        this.onChanges();
    }

    NewOc() {
        this.visible = false;
        this.visibledetails = true;
        this.visibleEditable = true;
    }

    SearchPurchaseOrder() {
        this, this.messageServices.clear();
        if(this.formGroup.get('mounthProduction').value){

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
        }else{
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, this.formGroup.get('orderCode').value,null).subscribe((response) => {
                
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
            this.searchButtonDisable = ((this.formGroup.get(this.orderCodeName).value && this.formGroup.get(this.orderCodeName).valid) || this.formGroup.get(this.mounthProduction).value) ? true : false;
        });
    }

    ShowDetails(detail) {
        this.service.purchase_orders(detail.id, null, null).subscribe((response) => {
            this.order = response[0];
            this.fechaVencimientoSelected = new Date(response[0].dueDate);
            if(response[0].productionMonth){

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

    sendOC(oc){

        let check = false;
        this.service.purchase_orders(oc.id,null,null).subscribe((response) => {
            
            if(response[0].detail.length > 0){
                this.confirmationService.confirm({
                    message: '¿Seguro qué desea enviar este registro?',
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
            }else{
            this.messageServices.add({ key: 'error', severity: 'info', summary: 'La orden de compra no tiene pedidos' });

            }
        });

        
            

        
       
    }

    EditOrden(purchaseOrder) {

        this.service.purchase_orders(purchaseOrder.id, null, null).subscribe((response) => {
            this.order = response[0];
            this.fechaVencimientoSelected = new Date(response[0].dueDate);
            if(response[0].productionMonth){
                this.fechaProductionMonthSelected = new Date(response[0].productionMonth.substring(0, 4), response[0].productionMonth.substring(4, 6), 0, 0, 0, 0, 0);
            }
            this.visible = false;
            this.visibledetails = true;
            this.visibleEditable = false;
        });

    }

    CloseEditar(){
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.TableOrderFull();
    }

    closeGenerar(){
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.TableOrderFull();
    }

}

