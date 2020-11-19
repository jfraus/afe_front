import { Component, Input } from '@angular/core';

@Component({
  selector: 'editar-contrato-venta',
  templateUrl: './editar-contrato-venta.component.html',
  styleUrls: ['./editar-contrato-venta.component.css'],
})
export class EditarContratoVentaComponent {
    @Input()contrato: any;
    displayAgregar: boolean;
    cols = [];
    constructor(){
      this.cols = [
        { field: 'contracNumber', header: 'Carrier' },
        { field: 'countryName', header: 'Tipo' },
        { field: 'dealerName', header: 'Modelo' },
        { field: 'port', header: 'Color' },
        { field: 'createDate', header: 'Color Interior' },
        { field: 'quantity', header: 'Pedido' },
        { field: 'action', header: 'Acción' },
    ];
    }

    viewAgregar(){
      this.displayAgregar = true;
    }

    closedAgregar(){
      this.displayAgregar = false;

    }
    
}
