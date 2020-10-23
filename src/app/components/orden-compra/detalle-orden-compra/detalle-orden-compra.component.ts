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
    @Input() fechaProductionMonth = new Date();
    @Input() fechaVencimiento = new Date();

    constructor(){
        this.cols = [
            { field: 'model.type.type', header: 'Tipo' },
            { field: 'model.code', header: 'Modelo' },
            { field: 'color.code', header: 'Color' },
            { field: 'color.interiorCode', header: 'Color interior' },
            { field: 'quantity', header: 'Canitdad' },
        ];

    }
    ngOnInit(): void {

    }

    Close(){
        this.close.emit(true);
    }

}
