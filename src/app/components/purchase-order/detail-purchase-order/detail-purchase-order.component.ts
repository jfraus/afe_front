import { EventEmitter, Input } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
    selector: 'detail-purchase-order-component',
    templateUrl: './detail-purchase-order.component.html',
})
export class DetailPurchaseOrderComponent implements OnInit{

    cols=[];
    purchaseOrderDetail=[];
    loadingPurchaseOrderDetail=true;
    @Output() close = new EventEmitter();
    @Input() order: any;
    @Input() dateProductionMonth = new Date();
    @Input() dateExpired = new Date();

    constructor(){
        this.cols = [
            { field: 'model.type.type', header: 'Tipo' },
            { field: 'model.code', header: 'Modelo' },
            { field: 'color.code', header: 'Color' },
            { field: 'color.interiorCode', header: 'Color interior' },
            { field: 'quantity', header: 'Pedido' },
            { field: 'assigned', header: 'Asignado' },
        ];

    }
    ngOnInit(): void {

    }

    Close(){
        this.close.emit(true);
    }

}
