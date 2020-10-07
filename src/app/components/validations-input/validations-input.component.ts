import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: 'validations-input-component',
    templateUrl: './validations-input.component.html',
    styleUrls: ['./validations-input.component.css'],
})
export class ValidationsInputComponent {
    //var used to validations
    @Input() validation_messages = [];

    //var to control by form group
    @Input() formGroup: FormGroup;

    //var used to formcontrol name to input
    @Input() formInputName: String = '';

    constructor(){}
}

