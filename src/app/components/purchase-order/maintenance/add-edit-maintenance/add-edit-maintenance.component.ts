import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maintenance } from 'src/app/models/maintenance.model';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { isNullOrUndefined } from 'util';
import { PurchaseOrderMaintenance } from 'src/app/models/PurchaseOrderMaintenance';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: './add-edit-maintenance.component.html',
  providers: [ModelControllerService, ModelColorControllerService, PurchaseOrdenControllerService]
})
export class AddEditMaintenanceComponent implements OnInit {
  @Input() display: boolean;
  @Input() maintenance: Maintenance;
  @Output() close = new EventEmitter();
  @Input() models: SelectItem[];  
  @Input() modelTypes: SelectItem[];  
  @Input() purchaseOrderId;
  @Input() purchaseOrder;
  @Input() colors: SelectItem[];  
  title: string;
  titleButton: string;
  addMaintenance: FormGroup;
  actualPedido : number;

  constructor(private formBuilder: FormBuilder, private modelControllerService: ModelControllerService,
    private modelColorService: ModelColorControllerService, private servicesPurchase: PurchaseOrdenControllerService,
    public messageServices: MessageService) { }

  ngOnInit() {
    this.addMaintenance = this.formBuilder.group({
      id: [''],
      plant: [{ value: 'HCL', disabled: true }, [Validators.required]],
      modelType: ['', [Validators.required]],
      model: ['', [Validators.required]],
      color: ['', [Validators.required]],
      interiorColor: [{ value: '', disabled: true }, [Validators.required]],
      cantidad: ['', [Validators.required]],
    });

    if(!isNullOrUndefined(this.maintenance)) {
      this.title = "Editar pedido";
      this.titleButton = "Guardar";
      if(this.purchaseOrder.startsWith("12L")) {
        this.loadData12L();
      }else{
        this.loadData12C();        
      }      
      this.actualPedido = this.maintenance.order;
      this.addMaintenance.get('cantidad').setValue(this.maintenance.order);
      this.addMaintenance.get('id').setValue(this.maintenance.purchaseOrderDetailId);
    }else {
      if(this.purchaseOrder.startsWith("12L")){
        let type = this.modelTypes.find(d => d.value == 'KK').label;  
        this.addMaintenance.get('modelType').setValue(type);
        this.addMaintenance.get('modelType').disable();
        this.loadModel('KK', true);      
      }
      this.title = "Agregar pedido";
      this.titleButton = "Agregar";
    }    
  }

  private loadData12L(){
    this.blockModal();
    let type = this.modelTypes.find(d => d.value == 'KK').label;      
    this.addMaintenance.get('modelType').setValue(type);
    this.addMaintenance.get('modelType').disable();
    let model = this.models.find(data => data.label == this.maintenance.model);
    this.addMaintenance.get('model').setValue(model.value);
    setTimeout(() => { 
      let color = this.colors.find(data => data.label == this.maintenance.color);
      this.addMaintenance.get('color').setValue(color.value);      
      this.addMaintenance.get('interiorColor').setValue(color.value.interiorCode);
    }, 1000);    
  }

  private loadData12C(){
    this.blockModal();
    setTimeout(() => { 
      let type = this.modelTypes.find(d => d.value == this.maintenance.type).label;  
      this.addMaintenance.get('modelType').setValue(type);
      let model = this.models.find(data => data.label == this.maintenance.model);
      this.addMaintenance.get('model').setValue(model.value);
      let color = this.colors.find(data => data.label == this.maintenance.color);
      this.addMaintenance.get('color').setValue(color.value);      
      this.addMaintenance.get('interiorColor').setValue(color.value.interiorCode);     
  }, 1000);    
  }

  private blockModal(){
    this.addMaintenance.get('modelType').disable();
    this.addMaintenance.get('model').disable();
    this.addMaintenance.get('color').disable();
    this.addMaintenance.get('interiorColor').disable();
  }

  private loadModel(modelType: String, modelExclude: boolean): void { 
    this.modelControllerService.getModelsByType(modelType, modelExclude).subscribe(data => {
      this.models = data.map(r => (
        { label: r.code, value: r.id }
      ));
    });
  }

  private loadColor(model: string): void {
    this.modelColorService.get(model).subscribe(data => {
      this.colors = data.map(r => (
        { label: r.code, value: r }
      ));
    });
  }

  selectedChangeModelType(e) {    
    this.loadModel(this.addMaintenance.get('modelType').value, false); 
  }

  selectedChangeModel(e) {
    if (e.value) {
      this.loadColor(e.value);
    } else {
      this.addMaintenance.get('colors').reset();
      this.colors = [];
    }
  }

  changeColor() {
    let interiorCode = this.addMaintenance.get('color').value;
    if (interiorCode !== null) {
      this.addMaintenance.get('interiorColor').setValue(interiorCode.interiorCode);
    }
  }

  closed() {    
    this.close.emit(true);  
    this.addMaintenance.reset();
  }

  add(maintenance: Maintenance) {    
    if (this.addMaintenance.valid) {      
      if(!isNullOrUndefined(this.maintenance)) {
        if(this.addMaintenance.value.cantidad < this.actualPedido){
          this.messageServices.add({ key: 'error', severity: 'info', summary: 'La cantidad no puede ser menor a la original' });          
        }else{
          let addDetail: PurchaseOrderMaintenance = {
            id: this.addMaintenance.value.id,            
            quantity: this.addMaintenance.value.cantidad
          };
          this.servicesPurchase.putPurchaseOrderMaintenanceDetails(addDetail).subscribe(() => {
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Actualizado con éxito' });
            this.changeStatus(this.purchaseOrderId);
            setTimeout(() => { 
              this.closed();
            }, 1000);    
          });
        }
      }else{
        let addDetail: PurchaseOrderDetail = {
          id: this.addMaintenance.value.id,
          purchaseOrderId: this.purchaseOrderId,
          model: {
            id: this.addMaintenance.value.model
          },
          color: this.addMaintenance.value.color,
          quantity: this.addMaintenance.value.cantidad
        };
        this.servicesPurchase.postPurchaseOrderDetail(addDetail).subscribe((response) => {
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Guardado con éxito' });
          this.changeStatus(this.purchaseOrderId);
          setTimeout(() => { 
            this.closed();
          }, 1000);    
        });
      }
    }
  }

  private changeStatus(purchaseOrderId: string){
    this.servicesPurchase.changeStatusPurchaseOrderMaintenance(purchaseOrderId).subscribe((response) =>{  });
  }
  
}