import { Component, OnInit } from '@angular/core';
import { port } from 'src/app/models/port.model'
import { PortControllerService } from 'src/app/services/port-controller-service';

@Component({
  selector: 'app-port-catalog',
  templateUrl: './port-catalog.component.html',
  styleUrls: ['./port-catalog.component.css'],
  providers: [ PortControllerService ]
})
export class PortCatalogComponent implements OnInit {

  cols = [];
  loadingPort:boolean = false;
  ports: port[] =[];

  constructor(private portControllerService :PortControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'portCode', header: 'Código de Puerto'},
      {field: 'portDescription', header: 'Descripción de Puerto'},
      {field: 'countryName', header: 'País'}
    ]
    this.getPorts();

  }

  getPorts(){
    this.loadingPort = true;
    this.portControllerService.getClients().subscribe(data=>{      
        this.ports = data;
        this.loadingPort = false;
    });
  }

  updatePort(port: port){

  }

  addUpdate() {

  }

}
