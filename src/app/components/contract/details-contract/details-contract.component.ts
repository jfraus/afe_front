import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';

@Component({
  selector: 'details-contract-component',
  templateUrl: './details-contract.component.html',
  styleUrls: ['./details-contract.component.css'],
  providers: [SaleContractControllerService]
})
export class ContractDetailsComponent {
  @Input() contrato: any;
  @Input() detail: any;
  @Output() close = new EventEmitter();
  cols = [];

  constructor(public confirmationService: ConfirmationService, private services: SaleContractControllerService) {
    this.cols = [
      { field: 'carrierName', header: 'Carrier' },
      { field: 'modelType', header: 'Tipo' },
      { field: 'modelCode', header: 'Modelo' },
      { field: 'colorCode', header: 'Color' },
      { field: 'coloInterior', header: 'Color Interior' },
      { field: 'quantity', header: 'Pedido' },
    ];
  }

  closed(){
    this.close.emit(true);
  }

}
