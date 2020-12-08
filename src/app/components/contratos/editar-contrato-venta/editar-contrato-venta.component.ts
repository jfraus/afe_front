import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';

@Component({
  selector: 'editar-contrato-venta',
  templateUrl: './editar-contrato-venta.component.html',
  styleUrls: ['./editar-contrato-venta.component.css'],
  providers: [SaleContractControllerService]
})
export class EditarContratoVentaComponent {
  @Input() contrato: any;
  @Input() detail: any;
  detailEdtiar: any;
  editar: boolean = false;
  displayAgregar: boolean;
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

  viewAgregar() {
    this.displayAgregar = true;
  }

  eliminarDetail(detail) {

  }

  closedAgregar() {
    this.displayAgregar = false;
    this.services.get(null, null, null, this.contrato.id).subscribe((response) => {
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

  eliminarDetalle(detail) {
    this.confirmationService.confirm({
      message: '¿Seguro qué desea eliminar este registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.services.deletedDetail(detail.id).subscribe((response) => {
          this.services.get(null, null, null, this.contrato.id).subscribe((response) => {
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
        });
      },
      reject: () => {

      }
    });
  }

  editarDetalle(detail) {
    this.detailEdtiar = detail;
    this.editar = true;
    this.displayAgregar = true;
  }

  salir(){
    this.close.emit(true);
    this.detail = [];
  }

}
