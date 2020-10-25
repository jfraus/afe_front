import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: 'generar_orden_compra',
    templateUrl: './generar-orden-compra.component.html',
    styleUrls: ['./generar-orden-compra.component.css'],
})
export class GenerarOrdenCompraComponent implements OnInit {
   
    purchaseOrderDetail=[];
    loadingPurchaseOrderDetail=true;
    cols=[];
    displayAdd: boolean;

    constructor(){
        this.cols = [
            { field: 'orderNumber', header: 'Tipo' },
            { field: 'productionMonth', header: 'Modelo' },
            { field: 'dueDate', header: 'Color' },
            { field: 'unitsQuantity', header: 'Color interior' },
            { field: 'status', header: 'Canitdad' },
            { field: 'action', header: 'Acción' },
        ];
    }
    ngOnInit(): void {}

    add(){
        this.displayAdd =  true;         
    }

    salir(){     
    }
}

