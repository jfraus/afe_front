import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { FormatDate } from "src/app/utils/format-date";
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { PurchaseOrder } from "src/app/models/purchase-order.model";

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
    monthProduction = 'monthProduction';
    order: any;
    searchButtonDisable = false;
    visibledetails: boolean = true;
    visibleEditable = false;
    fechaProductionMonthSelected = new Date();
    fechaVencimientoSelected = new Date();
    visible: boolean = true;
    visibleMaintenance: boolean = false;
    types = [];
    models = [];
    colors = [];
    maintenanceDetails: any;

    constructor(public dateUtil: FormatDate, public confirmationService: ConfirmationService, public messageServices: MessageService,
        private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService,
        private modelControllerService: ModelControllerService, private modelColorService: ModelColorControllerService) {

        this.tableOrderFull();
        this.buildForm();
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
        this.validations.push(this.messages.getValidationMessagesWithName('monthProduction'));
    }

    ngOnInit(): void {
        this.onChanges();
        this.loadType();
    }

    selectedChangeType(e) {
        if (e.value) {
            this.formGroup.controls['orderCode'].disable();
            this.formGroup.controls['monthProduction'].disable();
            this.loadModel(e.value);
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
        } else {
            this.formGroup.get('model').reset();
            this.formGroup.get('color').reset();
            this.models = [];
            this.colors = [];
            this.formGroup.controls['orderCode'].enable();
            this.formGroup.controls['monthProduction'].enable();
        }
    }

    selectedChangeModel(e) {
        if (e.value) {
            this.loadColor(e.value);
        } else {
            this.formGroup.get('color').reset();
            this.colors = [];
        }
    }

    selectedChangeOrderCode(e) {
        let x = this.formGroup.get('orderCode').value;
        if (x.length > 0) {
            this.formGroup.controls['monthProduction'].disable();
            this.formGroup.controls['model'].disable();
            this.formGroup.controls['color'].disable();
            this.formGroup.controls['type'].disable();
        } else {
            this.formGroup.controls['monthProduction'].enable();
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
            this.formGroup.controls['type'].enable();
        }
    }

    selectedChangeMonthProduction(e) {
        let x = this.formGroup.get('monthProduction').value;
        if (x != null) {
            this.formGroup.controls['orderCode'].disable();
            this.formGroup.controls['model'].disable();
            this.formGroup.controls['color'].disable();
            this.formGroup.controls['type'].disable();
        } else {
            this.formGroup.controls['orderCode'].enable();
            this.formGroup.controls['model'].enable();
            this.formGroup.controls['color'].enable();
            this.formGroup.controls['type'].enable();
        }
    }

    private loadType(): void {
        this.types = [
            { label: 'KA', value: 'KA' },
            { label: 'KC', value: 'KC' },
            { label: 'KK', value: 'KK' }
        ];
    }

    private loadModel(modelType: String): void {
        this.modelControllerService.getModelsByType(modelType, undefined).subscribe(data => {
            this.models = data.map(r => (
                { label: r.code, value: r.id }
            ));
        });
    }

    private loadColor(model: string): void {
        this.modelColorService.get(model).subscribe(data => {
            this.colors = data.map(r => (
                { label: r.code, value: r.id }
            ));
        });
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            orderCode: ['', [Validators.maxLength(7), Validators.minLength(7)]],
            monthProduction: ['', []],
            model: new FormControl({ value: '', disabled: true }),
            color: new FormControl({ value: '', disabled: true }),
            type: ['', []]
        });
    }

    tableOrderFull() {
        this.service.purchase_orders(null, null, null, null, null, null).subscribe((response) => {
            this.purchaseOrder = response;
            this.purchaseOrder = this.purchaseOrder.map(iteam => ({
                ...iteam,
                dueDate: this.dateUtil.formatDateWithoutTime(iteam.dueDate)
            }))
            this.loadingPurchaseOrder = false;
        });
    }

    newOc() {
        this.visible = false;
        this.visibledetails = true;
        this.visibleEditable = true;
    }

    searchPurchaseOrder() {
        this, this.messageServices.clear();
        if (this.formGroup.get('monthProduction').value) {
            let date = new Date(this.formGroup.get('monthProduction').value);
            let monthProduction = this.dateUtil.getYear(date).toString() + this.dateUtil.getMonth(date).toString();
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, this.formGroup.get('orderCode').value, monthProduction, null, null, null).subscribe((response) => {
                if (response.length > 0) {
                    this.purchaseOrder = response;
                } else {
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.purchaseOrder = [];
                }
                this.loadingPurchaseOrder = false;
                this.formGroup.get('orderCode').reset();
                this.formGroup.get('monthProduction').reset();
            });
        } else if (this.formGroup.get('orderCode').value) {
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, this.formGroup.get('orderCode').value, null, null, null, null).subscribe((response) => {
                if (response.length > 0) {
                    this.purchaseOrder = response;
                } else {
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.purchaseOrder = [];
                }
                this.loadingPurchaseOrder = false;
                this.formGroup.get('orderCode').reset();
                this.formGroup.get('monthProduction').reset();
            });
        } else if (this.formGroup.get('type').value) {
            this.loadingPurchaseOrder = true;
            this.service.purchase_orders(null, null, null, this.formGroup.get('type').value, this.formGroup.get('model').value, this.formGroup.get('color').value).subscribe((response) => {
                if (response.length > 0) {
                    this.purchaseOrder = response;
                } else {
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.purchaseOrder = [];
                }
                this.loadingPurchaseOrder = false;
                this.formGroup.get('orderCode').enable();
                this.formGroup.get('monthProduction').enable();
                this.formGroup.get('type').reset();
                this.formGroup.get('color').reset();
                this.formGroup.get('model').reset();
            });
        }
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.searchButtonDisable = ((this.formGroup.get(this.orderCodeName).value && this.formGroup.get(this.orderCodeName).valid)
                || this.formGroup.get(this.monthProduction).value || (this.formGroup.get('type').value && this.formGroup.get('model').value && this.formGroup.get('color').value))
                ? true : false;
        });
    }

    showDetails(detail) {
        this.service.purchase_orders(detail.id, null, null, null, null, null).subscribe((response) => {
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

    closeDetails() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
    }

    sendOC(oc) {
        let check = false;
        this.service.purchase_orders(oc.id, null, null, null, null, null).subscribe((response) => {
            if (response[0].detail.length > 0) {
                this.confirmationService.confirm({
                    message: 'Deseas enviar OC, una vez enviada no se podrá editar.',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.service.enviarPurchaseOrder(oc.id).subscribe((response) => {
                            this.tableOrderFull();
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

    editOrden(purchaseOrder) {
        this.service.purchase_orders(purchaseOrder.id, null, null, null, null, null).subscribe((response) => {
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

    closeEditar() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.tableOrderFull();
    }

    closeGenerar() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.tableOrderFull();
    }

    closeMaintenance() {
        this.visible = true;
        this.visibledetails = true;
        this.visibleEditable = true;
        this.visibleMaintenance = false;
        this.tableOrderFull();
    }

    sendAssignment(): void {
        this.service.sendAssignment().subscribe((response) => {
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Enviado!' });
        });
    }

    maintenance(maintenance: PurchaseOrder) {
        this.confirmationService.confirm({
            message: '¿Deseas dar mantenimiento a la orden de compra ' + maintenance.status + ' ' + maintenance.orderNumber + ' ?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.maintenanceDetails = maintenance;
                this.visible = false;
                this.visibleMaintenance = true;
            },
            reject: () => {

            }
        });
    }
}

