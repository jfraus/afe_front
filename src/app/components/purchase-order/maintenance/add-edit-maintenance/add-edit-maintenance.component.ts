import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maintenance } from 'src/app/models/maintenance.model';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';
import { isNullOrUndefined } from 'util';

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
  @Input() purchaseOrderId;
  title: string;
  titleButton: string;
  addMaintenance: FormGroup;
  colors: SelectItem[] = [];
  actualPedido : number;

  constructor(private formBuilder: FormBuilder, private modelControllerService: ModelControllerService,
    private modelColorService: ModelColorControllerService, private servicesPurchase: PurchaseOrdenControllerService,
    public messageServices: MessageService) { }

  ngOnInit() {
    this.addMaintenance = this.formBuilder.group({
      id: [''],
      plant: [{ value: 'HCL', disabled: true }, [Validators.required]],
      modelType: [{ value: 'KK', disabled: true }, [Validators.required]],
      model: ['', [Validators.required]],
      color: ['', [Validators.required]],
      interiorColor: [{ value: '', disabled: true }, [Validators.required]],
      cantidad: ['', [Validators.required]],
    });

    if(!isNullOrUndefined(this.maintenance)) {
      this.title = "Editar pedido";
      this.titleButton = "Guardar";
      let model = this.models.find(data => data.label == this.maintenance.model);  
      setTimeout(() => {
        new Promise((resolved) => {                  
          this.addMaintenance.get('model').setValue(model.value);          
          this.loadColor(model.value);          
          resolved(true);      
        });
      }, 600);

      setTimeout(() => {
        new Promise((resolved) => {            
          this.loadColor(model.value);
          let color = this.colors.find(data => data.label == this.maintenance.color);
          this.addMaintenance.get('color').setValue(color.value);      
          this.addMaintenance.get('interiorColor').setValue(color.value.interiorCode);
        });
      }, 800);     
      this.actualPedido = this.maintenance.order;
        this.addMaintenance.get('cantidad').setValue(this.maintenance.order);
        this.addMaintenance.get('id').setValue(this.maintenance.purchaseOrderDetailId);
    }else {
      this.loadModel(this.addMaintenance.get('modelType').value);
      this.title = "Agregar pedido";
      this.titleButton = "Agregar";
    }    
  }

  private loadModel(modelType: String): void {
    this.modelControllerService.getModelsByType(modelType).subscribe(data => {
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
      let addDetail: PurchaseOrderDetail = {
        id: this.addMaintenance.value.id,
        purchaseOrderId: this.purchaseOrderId,
        model: {
          id: this.addMaintenance.value.model
        },
        color: this.addMaintenance.value.color,
        quantity: this.addMaintenance.value.cantidad
      };
      if(!isNullOrUndefined(this.maintenance)) {
        if(this.addMaintenance.value.cantidad < this.actualPedido){
          this.messageServices.add({ key: 'error', severity: 'info', summary: 'La cantidad no puede ser menor a la original' });          
        }else{
          this.servicesPurchase.putPurchaseOrderDetail(addDetail).subscribe((response) => {
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Actualizado con éxito' });
            this.changeStatus(this.purchaseOrderId);
            this.closed();
          });
        }
      }else{
        this.servicesPurchase.postPurchaseOrderDetail(addDetail).subscribe((response) => {
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Guardado con éxito' });
          this.changeStatus(this.purchaseOrderId);
          this.closed();
        });
      }
    }
  }

  private changeStatus(purchaseOrderId: string){
    this.servicesPurchase.changeStatusPurchaseOrderMaintenance(purchaseOrderId).subscribe((response) =>{  });
  }
  
}