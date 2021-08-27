import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Port } from 'src/app/models/port.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-port-add-update',
  templateUrl: './port-add-update.component.html'
})
export class PortAddUpdateComponent implements OnInit {

  addUpdatePort: FormGroup;
  @Input() display: boolean;
  @Output() close = new EventEmitter();
  @Input() port: Port;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addUpdatePort = this.formBuilder.group({
      id:[''],
      portCode: ['', [Validators.required]],
      portDescription: ['', [Validators.required]],
      countryName: ['', [Validators.required]]
    });

    if(isNullOrUndefined(this.port)) {
      this.addUpdatePort.patchValue(this.port);
    }
  }

  add() {
    if(this.addUpdatePort.valid) {
      console.log('aqui');
      
    }
  }

  closed() {
    this.close.emit(true);
  }
}
