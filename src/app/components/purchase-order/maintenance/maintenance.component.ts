import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Maintenance } from 'src/app/models/maintenance.model';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { SelectItem } from "primeng/api";
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  providers: [PurchaseOrdenControllerService, ModelControllerService, ModelColorControllerService, ConfirmationService]
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
  models: SelectItem[];

  constructor(private maintenanceService: PurchaseOrdenControllerService, private formBuilder: FormBuilder, 
    private modelColorService: ModelColorControllerService, private modelControllerService: ModelControllerService, 
    public confirmationService: ConfirmationService) { }

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
    });;
    this.getMaintenance(this.maintenanceDetails.id);   
    this.loadModel("KK") ;
  }

  getMaintenance(id: number) {
    this.loadingMaintenance = true;
    this.maintenanceService.getMaintenance(id).subscribe(data => {     
      this.maintenanceList = data;
      this.loadingMaintenance = false;
    });
  }

  getHeaders(){
    this.maintenanceService.purchase_orders(this.maintenanceDetails.id,null,null,null,null,null).subscribe((response) => {
      this.loadingMaintenance = true;
      this.maintenanceList = response[0].detail;
        this.formGroup.get('totalOrder').setValue(response[0].unitsQuantity);
        this.formGroup.get('status').setValue(response[0].status);
        this.loadingMaintenance = false;
    });
  }

  editMaintenance(maintenance: Maintenance) {
    this.confirmationService.confirm({
      message: '¿Deseas editar el modelo '+maintenance.model+' y color '+maintenance.color+' ?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {        
        this.maintenance = maintenance;    
        this.displayAddEdit=true;
      },
      reject: () => {
      }
    });    
  }

  addUpdate(){
    this.displayAddEdit=true;
  }

  closeAddEdit() {
    console.log("Cierra el Dialog");
    this.displayAddEdit=false;
    setTimeout(() => { this.getMaintenance(this.maintenanceDetails.id)}, 100);
    setTimeout(() => { this.getHeaders() }, 100);
  }

 closeMaintenance(){
    console.log("Si llega");
    this.close.emit(true);  
    this.maintenance = null;    
    this.displayAddEdit=false;   
    this.maintenanceList =[];   
  }
    
  private loadModel(modelType: String): void {
    this.modelControllerService.getModelsByType(modelType).subscribe(data => {
      this.models = data.map(r => (
        { label: r.code, value: r.id }
      ));
    });
  }

}
