import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
    selector: 'detalle-orden-compra',
    templateUrl: './detalle-orden-compra.component.html',
})
export class DetalleOrdenCompraComponent implements OnInit{

    cols=[];
    purchaseOrderDetail=[];
    loadingPurchaseOrderDetail=true;
    @Output() close = new EventEmitter();
    @Input() order: any;

    constructor(){

        this.cols = [
            { field: 'model.code', header: 'Tipo' },
            { field: 'productionMonth', header: 'Modelo' },
            { field: 'dueDate', header: 'Color' },
            { field: 'unitsQuantity', header: 'Color interior' },
            { field: 'status', header: 'Canitdad' },
        ];

    }
    ngOnInit(): void {

    }

    Close(){
        this.close.emit(true);
    }

}
