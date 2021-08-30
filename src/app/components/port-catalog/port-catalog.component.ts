import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Port } from 'src/app/models/port.model'
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { PortControllerService } from 'src/app/services/port-controller.service';

@Component({
  selector: 'app-port-catalog',
  templateUrl: './port-catalog.component.html',
  styleUrls: ['./port-catalog.component.css'],
  providers: [ PortControllerService, CountryControllerService ]
})
export class PortCatalogComponent implements OnInit {

  cols = [];
  loadingPort:boolean = false;
  ports: Port[] =[];
  addUpdatePort: boolean = false;
  port: Port;
  country: SelectItem[] = [];

  constructor(private portControllerService :PortControllerService, private countryService: CountryControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'portCode', header: 'Código de Puerto'},
      {field: 'portDescription', header: 'Descripción de Puerto'},
      {field: 'countryName', header: 'País'}
    ]
    this.getPorts();
    this.getCountry();
  }

  getPorts(){
    this.loadingPort = true;
    this.portControllerService.getPort().subscribe(data=>{      
        this.ports = data;
        this.loadingPort = false;
    });
  }

  updatePort(port: Port){
    this.port = port;
    this.addUpdatePort = true;
  }

  addUpdate() {
    this.addUpdatePort = true;
  }

  closeAddUpdate() {
    this.port = null;
    this.addUpdatePort = false;
    this.getPorts();
  }

  getCountry() {
    this.countryService.get().subscribe(data => {
      this.country = data.map(r => (       
        { label: r.name, value: r.countryCode}
      ));
    });
  }
}
