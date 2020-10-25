import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { SelectItem } from 'primeng/api';
import { ModelControllerService } from 'src/app/services/model-controller.service';


@Component({
    selector: 'agregar-pedido-modelo',
    templateUrl: './agregar-pedido-modelo.components.html',
    styleUrls: ['./agregar-pedido-modelo.components.css'],
    providers: [ModelControllerService]
})
export class AgregarPedidoModeloComponent {
    @Input() display: boolean;
    @Output() close = new EventEmitter();
    colors: SelectItem[] = [];
    models: SelectItem[] = [];
    addModel: FormGroup;

    constructor(private fb: FormBuilder, private services: ModelControllerService){
        this.BuildForm();
        this.fillModel();
    }

    private BuildForm() {
        this.addModel = this.fb.group({
            model: ['', [Validators.required]],
            plant:new FormControl({value:'', disabled:true}),
            modelType:new FormControl({value:'', disabled:true}),
            color: new FormControl('', Validators.required),
            internalColor: new FormControl({value:'', disabled:true}),
            quantity: new FormControl('', Validators.required)
        });
    }

    fillModel(){
        this.services.get(true).subscribe((rs) => {
            this.models = rs.map(r => (
                { label: r.code, value: r}
            ))
        })
    }

    selectModel():void{
        let model = this.addModel.get('model').value;
        let isSelected = model !== null;
        this.addModel.get('modelType').setValue(isSelected ? model.type.type : '');
        this.addModel.get('plant').setValue(isSelected ? model.plant.salesCode : '');
    }

    selectColor():void{
        let color = this.addModel.get('color').value;
        this.addModel.get('internalColor').setValue(color !== null ? color: '');
    }

    agregar(){
    }

    closed(){
        this.close.emit(false);
    }
}

