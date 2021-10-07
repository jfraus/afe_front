import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maintenance } from 'src/app/models/maintenance.model';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';
import { PurchaseOrdenControllerService } from 'src/app/services/purchase-orden-controller.service';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-detail.model';


@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: './add-edit-maintenance.component.html',
  providers: [ModelControllerService, ModelColorControllerService, PurchaseOrdenControllerService]
})
export class AddEditMaintenanceComponent implements OnInit {
  @Input() display: boolean;
  @Input() maintenance: Maintenance;
  @Output() close = new EventEmitter();
  @Input() purchaseOrderId;
  title: string;
  titleButton: string;
  addMaintenance: FormGroup;
  models: SelectItem[] = [];
  colors: SelectItem[] = [];

  constructor(private formBuilder: FormBuilder, private modelControllerService: ModelControllerService,
    private modelColorService: ModelColorControllerService, private servicesPurchase: PurchaseOrdenControllerService,
    public messageServices: MessageService) { }

  ngOnInit() {
    this.addMaintenance = this.formBuilder.group({
      id: [''],
      plant: [{ value: 'HCL', disabled: true }, [Validators.required]],
      modelType: [{ value: 'KK', disabled: true }, [Validators.required]],
      model: [''],
      color: [''],
      interiorColor: [{ value: '', disabled: true }, [Validators.required]],
      cantidad: ['']
    });

    if (this.maintenance == null) {
      this.title = "Agregar pedido";
      this.titleButton = "Agregar";
    } else {
      this.title = "Editar pedido";
      this.titleButton = "Guardar";
    }
    this.loadModel(this.addMaintenance.get('modelType').value)
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
    
    this.addMaintenance.reset();    
    this.close.emit(true);    
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
      this.servicesPurchase.postPurchaseOrderDetail(addDetail).subscribe((response) => {
        this.messageServices.add({ key: 'error', severity: 'success', summary: 'Guardado con éxito' });
        this.closed();
      });
    }
  }
}