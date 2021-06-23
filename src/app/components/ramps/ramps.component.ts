import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Ramp } from 'src/app/models/ramp.model';
import { RampsControllerService } from 'src/app/services/ramps-controller.service';

@Component({
  selector: 'app-ramps',
  templateUrl: './ramps.component.html',
  styleUrls: ['./ramps.component.css'],
  providers: [RampsControllerService]
})
export class RampsComponent implements OnInit {

  cols = [];
  ramp: Ramp;
  ramps: Ramp[] = [];
  visibleEdit: boolean = false;
  loadingRamps: boolean = false;
  displayUpdate: boolean = false;
  @Output() close = new EventEmitter();
  

  constructor(private rampsService: RampsControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'code', header: 'Código de rampa'},
      {field: 'city', header: 'Ciudad'},
      {field: 'state', header: 'Estado'},
      {field: 'port', header: 'Puerto Aduanal'}
    ];
    this.searchRamps();
  }

  searchRamps() {
    this.rampsService.get().subscribe(data => {      
      this.ramps = data;    
    });
  }

  updateRamp(ramp: Ramp) {
    this.ramp = ramp;
    this.visibleEdit = true;
    this.displayUpdate = true;
  }

  closedEditar() {
    this.searchRamps();
    this.displayUpdate = false;
  }
}
