import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';

@Component({
  selector: 'edit-sale-contract-component',
  templateUrl: './edit-sale-contract.component.html',
  styleUrls: ['./edit-sale-contract.component.css'],
  providers: [SaleContractControllerService]
})
export class EditSaleContractComponent {
  @Input() contract: any;
  @Input() detail: any;
  detailEdtiar: any;
  edit: boolean = false;
  displayAdd: boolean;
  cols = [];
  @Output() close = new EventEmitter();

  constructor(public confirmationService: ConfirmationService, private services: SaleContractControllerService) {
    this.cols = [
      { field: 'carrierName', header: 'Carrier' },
      { field: 'modelType', header: 'Tipo' },
      { field: 'modelCode', header: 'Modelo' },
      { field: 'colorCode', header: 'Color' },
      { field: 'coloInterior', header: 'Color Interior' },
      { field: 'quantity', header: 'Pedido' },
      { field: 'action', header: 'Acción' },
    ];
    this.detail = [];
  }

  viewAdd() {
    this.displayAdd = true;
  }

  eliminarDetail(detail) {

  }

  closedAdd() {
    this.displayAdd = false;
    this.services.get(null, null, null, this.contract.id).subscribe((response) => {
      let details = response[0];
      this.detail = details.detail.map(r => ({
        ...r,
        carrierName: r.carrier.name,
        modelType: r.model.type.type,
        modelCode: r.model.code,
        colorCode: r.color.code,
        coloInterior: r.color.interiorCode,
      }));
    });
  }

  deletedDetail(detail) {
    this.detail = [];
    this.confirmationService.confirm({
      message: '¿Seguro qué desea eliminar este registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.services.deletedDetail(detail.id).subscribe((response) => {
          this.services.get(null, null, null, this.contract.id).subscribe((response) => {
            let details = response[0];
            if(detail){
              this.detail = details.detail.map(r => ({
                ...r,
                carrierName: r.carrier.name,
                modelType: r.model.type.type,
                modelCode: r.model.code,
                colorCode: r.color.code,
                coloInterior: r.color.interiorCode,
              }));
            }
          });
        });
      },
      reject: () => {

      }
    });
  }

  updateDetalle(detail) {
    this.detailEdtiar = detail;
    this.edit = true;
    this.displayAdd = true;
  }

  closed(){
    this.close.emit(true);
    this.detail = [];
  }

}
