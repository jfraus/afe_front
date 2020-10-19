import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
@Component({
    selector: 'orden_compra',
    templateUrl: './orden-compra.component.html',
    styleUrls: ['./orden-compra.component.css'],
    providers: [PurchaseOrdenControllerService]
})
export class OrdenCompraComponent implements OnInit {

    purchaseOrder = [];
    loadingPurchaseOrder = true;
    cols = [];
    validations = [];
    formGroup: FormGroup = new FormGroup({
        orderCode: new FormControl(),
        mesProduction: new FormControl()
    });
    orderCodeName = "orderCode";
    mesProduction = 'mesProduction';
    searchButtonDisable = false;

    constructor(public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService) {
        this.tableOrderFull();
        this.buildForm();
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
        this.validations.push(this.messages.getValidationMessagesWithName('mesProduction'));

    }

    private buildForm() {
        this.formGroup = this.fb.group({
            orderCode: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
            mesProduction: ['', [Validators.required]]
        });
    }

    tableOrderFull() {
        this.service.purchase_orders(null, null).subscribe((response) => {
            this.purchaseOrder = response;
            this.loadingPurchaseOrder = false;

        });

    }

    visible: boolean = true;
    ngOnInit(): void {
        this.onChanges();
    }

    new_oc() {
        this.visible = false;
    }

    search_purchaseOrder() {
        this, this.messageServices.clear();
        let fecha = new Date(this.formGroup.get('mesProduction').value);
        console.log(fecha.getFullYear());

        console.log(this.formGroup.get('orderCode').value,);
        this.loadingPurchaseOrder = true;
        this.service.purchase_orders(this.formGroup.get('orderCode').value, `${fecha.getFullYear()}${fecha.getMonth() + 1}`).subscribe((response) => {
            if (response.lenght > 0) {

                this.purchaseOrder = response;

            } else {

                this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros'});
            }
            this.loadingPurchaseOrder = false;
            this.formGroup.get('orderCode').reset();
            this.formGroup.get('mesProduction').reset();

        });

    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.searchButtonDisable = this.formGroup.valid;
        });
    }

}

