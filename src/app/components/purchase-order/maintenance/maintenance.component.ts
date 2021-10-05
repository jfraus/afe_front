import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Maintenance } from 'src/app/models/maintenance.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  providers: [PurchaseOrdenControllerService]
})
export class MaintenanceComponent implements OnInit {

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
      purchaseOrder: [''],
      status: [''],
      monthProduction: [''],
      expirationDate: [''],
      totalOrder: ['']
    })
  }

  getMaintenance() {
    this.loadingMaintenance = true;
    this.maintenanceService.getMaintenance().subscribe(data => {
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
