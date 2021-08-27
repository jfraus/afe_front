import { Component, OnInit } from '@angular/core';
import { Port } from 'src/app/models/port.model'

@Component({
  selector: 'app-port-catalog',
  templateUrl: './port-catalog.component.html',
  styleUrls: ['./port-catalog.component.css']
})
export class PortCatalogComponent implements OnInit {

  cols = [];
  loadingPort:boolean = false;
  ports: Port[] =[];
  addUpdatePort: boolean = false;
  port: Port;

  constructor() { }

  ngOnInit() {
    this.cols = [
      {field: 'dealerNumber', header: 'Código de Puerto'},
      {field: 'dealerName', header: 'Descripción de Puerto'},
      {field: 'countryName', header: 'País'}
    ]
  }

  updatePort(port: Port){
    this.port = port;
    this.addUpdatePort = true;
  }

  addUpdate() {
    this.addUpdatePort = true;
  }

  closeAddUpdate() {
    this.addUpdatePort = false;
  }

}
