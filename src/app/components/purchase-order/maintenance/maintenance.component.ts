import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Maintenance } from 'src/app/models/maintenance.model';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { SelectItem } from "primeng/api";
import { ConfirmationService } from 'primeng/api';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  providers: [PurchaseOrdenControllerService, ModelControllerService, ConfirmationService]
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
  types = [];
  purchaseOrder: string;
  colors: SelectItem[] = [];

  constructor(private maintenanceService: PurchaseOrdenControllerService, private formBuilder: FormBuilder, 
    private modelControllerService: ModelControllerService, public confirmationService: ConfirmationService, 
    private modelColorService: ModelColorControllerService) { }

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

    this.purchaseOrder = this.maintenanceDetails.orderNumber;   
    if(this.purchaseOrder.startsWith("12L")){
      this.types =[{label: 'KK', value: 'KK'}];
      this.loadModel("KK", true);
    }else{
      this.loadType();
    }    
    this.getMaintenance(this.maintenanceDetails.id); 
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
        this.loadingMaintenance = true;  
        this.maintenance = maintenance;        
        if(this.purchaseOrder.startsWith("12L")){ 
          setTimeout(() => { this.loadingData(maintenance, true); }, 1000);   
        }else{
          setTimeout(() => { this.loadingData(maintenance, false); }, 1000);                            
        }        
        this.loadingMaintenance = false;        
      },
      reject: () => {        
      }
    });    
  }

  loadingData(maintenance: Maintenance, modelExclude: boolean){
    this.loadModel(maintenance.type, modelExclude);
    setTimeout(() => {
      let modelId = this.models.find(m => m.label === maintenance.model);
      this.loadColor(modelId.value); this.displayAddEdit=true;}, 4000);     
  }

  addUpdate(){
    this.maintenance = null;
    this.displayAddEdit=true;
  }

  closeAddEdit() {
    this.getMaintenance(this.maintenanceDetails.id);
    this.getHeaders();
    setTimeout(() => { this.displayAddEdit=false; }, 1000);    
  }

 closeMaintenance(){
    this.close.emit(true);  
    this.maintenance = null;    
    this.displayAddEdit=false;   
    this.maintenanceList =[];   
  }
    
  private loadModel(modelType: String, modelExclude: boolean): void {
    this.modelControllerService.getModelsByType(modelType, modelExclude).subscribe(data =>{
      this.models = data.map(r => (
        { label: r.code, value: r.id }
      ));
    });
  }

  private loadType() : void {
    this.types =[
        { label: 'KA', value: 'KA'  } ,
        { label: 'KC', value: 'KC' } ,
        { label: 'KK', value: 'KK' }
     ];
}

private loadColor(model: string): void {
  this.modelColorService.get(model).subscribe(data =>{
    this.colors = data.map(r => (
      { label: r.code, value: r }
    ));
  });
}

}
