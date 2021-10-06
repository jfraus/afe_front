import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Maintenance } from 'src/app/models/maintenance.model';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  providers: [PurchaseOrdenControllerService]
})
export class MaintenanceComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() maintenanceDetails: PurchaseOrder;
  maintenanceList: Maintenance[] = [];
  loadingMaintenance: boolean = false;
  formGroup: FormGroup;
  cols = [];
  displayAddEdit: boolean = false;
  maintenance: Maintenance;

  constructor(private maintenanceService: PurchaseOrdenControllerService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cols = [
      { field: 'type', header: 'Tipo' },
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'interiorColor', header: 'Color interior' },
      { field: 'order', header: 'Pedido' },
      { field: 'assigned', header: 'Asignado' }
    ];

    this.formGroup = this.formBuilder.group( {
      purchaseOrder: [{value: this.maintenanceDetails.orderNumber, disabled: true}],
      status: [{value: this.maintenanceDetails.status, disabled: true}],
      monthProduction: [{value: this.maintenanceDetails.productionMonth, disabled: true}],
      expirationDate: [{value: this.maintenanceDetails.dueDate, disabled: true}],
      totalOrder: [{value: this.maintenanceDetails.unitsQuantity, disabled: true}]
    });
    console.log(JSON.stringify(this.maintenanceDetails));
    this.getMaintenance(this.maintenanceDetails.id);
    
  }

  getMaintenance(id: number) {
    this.loadingMaintenance = true;
    this.maintenanceService.getMaintenance(id).subscribe(data => {
      this.maintenanceList = data;
      this.loadingMaintenance = false;
    });
  }

  editMaintenance() {
    
  }

  addUpdate(){
    this.displayAddEdit=true;
  }

  closeAddEdit() {

  }

}
