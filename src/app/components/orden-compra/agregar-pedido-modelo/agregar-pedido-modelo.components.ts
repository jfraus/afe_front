import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
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
    models=[];
    addModel: FormGroup;

    constructor(private fb: FormBuilder, private services: ModelControllerService){
        this.BuildForm();
        this.fillModel();
    }

    selectOtherOption(editPalletForm){

        this.addModel.get('model').setValue(editPalletForm.value);
        
    }

    fillModel(){
        this.services.get(false).subscribe((rs) => 
        {
            this.models = rs.map(x => (
                {
                    label: x.description,
                    value: x.id
                }
            ))
        })
    }

    private BuildForm() {
        this.addModel = this.fb.group({
            model: ['',[Validators.required]]
        });
    }

    agregar(){

    }

    
    Closed(){
        this.close.emit(false);
    }
}

