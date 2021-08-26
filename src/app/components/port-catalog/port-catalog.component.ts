import { Component, OnInit } from '@angular/core';
import { port } from 'src/app/models/port.model'

@Component({
  selector: 'app-port-catalog',
  templateUrl: './port-catalog.component.html',
  styleUrls: ['./port-catalog.component.css']
})
export class PortCatalogComponent implements OnInit {

  cols = [];
  loadingPort:boolean = false;
  ports: port[] =[];

  constructor() { }

  ngOnInit() {
    this.cols = [
      {field: 'dealerNumber', header: 'Código de Puerto'},
      {field: 'dealerName', header: 'Descripción de Puerto'},
      {field: 'countryName', header: 'País'}
    ]
  }

  updatePort(port: port){

  }

  addUpdate() {

  }

}
