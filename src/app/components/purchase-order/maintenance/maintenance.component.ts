import { Component, OnInit } from '@angular/core';
import { Maintenance } from 'src/app/models/maintenance.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html'
})
export class MaintenanceComponent implements OnInit {

  maintenanceList: Maintenance[] = [];
  loadingMaintenance: boolean = false;
  cols = [];

  constructor(private maintenanceService: PurchaseOrdenControllerService) { }

  ngOnInit() {
    this.cols = [
      { field: 'type', header: 'Tipo' },
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'interiorColor', header: 'Color interior' },
      { field: 'order', header: 'Pedido' },
      { field: 'assigned', header: 'Asignado' }
    ];
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

}
