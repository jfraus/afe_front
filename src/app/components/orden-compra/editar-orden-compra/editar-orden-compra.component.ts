import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
@Component({
    selector: 'edtiar-orden_compra',
    templateUrl: './editar-orden-compra.component.html',
    styleUrls: ['./editar-orden-compra.component.css'],
    providers: [PurchaseOrdenControllerService]
})
export class EditarOrdenCompraComponent implements OnInit {

    purchaseOrder = [];
    loadingPurchaseOrder = true;
    cols = [];
    validations = [];
    formGroup: FormGroup;
    orderCodeName = "orderCode";
    mesProduction = 'mesProduction';
    searchButtonDisable = false;

    constructor(public messageServices: MessageService, private service: PurchaseOrdenControllerService, private fb: FormBuilder, private messages: AppValidationMessagesService) {
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
        this.validations.push(this.messages.getValidationMessagesWithName('mesProduction'));

    }

    private BuildForm() {
        this.formGroup = this.fb.group({
            orderCode: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]],
            mesProduction: ['', [Validators.required]]
        });
    }

    TableOrderFull() {
       

    }

    visible: boolean = true;
    ngOnInit(): void {
        this.onChanges();
    }

    NewOc() {
        this.visible = false;
    }

    SearchPurchaseOrder() {
      

    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            this.searchButtonDisable = this.formGroup.valid;
        });
    }

}

