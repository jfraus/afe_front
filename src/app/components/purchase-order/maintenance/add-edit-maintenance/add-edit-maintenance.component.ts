import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maintenance } from 'src/app/models/maintenance.model';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ModelColorControllerService } from 'src/app/services/model-color-controller.service';

@Component({
  selector: 'app-add-edit-maintenance',
  templateUrl: './add-edit-maintenance.component.html',
  providers: [ModelControllerService, ModelColorControllerService]
})
export class AddEditMaintenanceComponent implements OnInit {
  @Input() display: boolean;
  @Input() maintenance: Maintenance;
  @Output() close = new EventEmitter();
  title: string;
  titleButton: string;
  addMaintenance: FormGroup;
  models: SelectItem[] = [];
  colors: SelectItem[] = [];

  constructor(private formBuilder: FormBuilder, private modelControllerService: ModelControllerService, private modelColorService: ModelColorControllerService) { }

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
        { label: r.code, value: r.interiorCode}
      ));
    });
  }

  selectedChangeModel(e){
    if(e.value){
        this.loadColor(e.value);
    }else{
        this.addMaintenance.get('colors').reset();
        this.colors = [];
    }
  }

  changeColor(){
    let interiorCode = this.addMaintenance.get('color').value;
    if(interiorCode !== null){
      this.addMaintenance.get('interiorColor').setValue(interiorCode);
    }

  }

  closed(){
    this.close.emit(true);
    this.addMaintenance.reset();
  }

  add(){


  }

}