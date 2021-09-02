import { Component, OnInit } from '@angular/core';
import { DistributionCenter} from 'src/app/models/distributionCenter.model';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service'
import { MessageService, SelectItem } from "primeng/api";
import { CountryControllerService } from 'src/app/services/country-controller.service';

@Component({
  selector: 'app-distribution-center',
  templateUrl: './distribution-center.component.html',
  styleUrls: ['./distribution-center.component.css'],
  providers:[DistributionControllerService, CountryControllerService]
})
export class DistributionCenterComponent implements OnInit {

  cols = [];
  loadingDistribution:boolean = false;
  distributions: DistributionCenter[] =[];
  displayAddEdit: boolean = false;
  distributionCenter: DistributionCenter;
  countryItems: SelectItem[];

  constructor(private distributionControllerService :DistributionControllerService, 
             private messageService :MessageService, private countryService: CountryControllerService,) { }

  getAllDistribution(): void {
    this.loadingDistribution = true;
    this.distributionControllerService.getAll().subscribe(data =>{
      if(data){
        this.distributions = data;
        this.loadingDistribution = false;
      }else{
        this.loadingDistribution = false;
        this.distributions = [];
        this.messageService.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });        
      }      
    });
  }

  ngOnInit() {
    this.cols = [
      {field: 'dealerNumber', header: 'No de Dealer'},
      {field: 'dealerName', header: 'Nombre del Dealer'},
      {field: 'countryName', header: 'País'},
      {field: 'distributionCode', header: 'Código de Distribución'},
      {field: 'port', header: 'Puerto'},
      {field: 'portCode', header: 'Código de Puerto'},
      {field: 'embarkPort', header: 'Puerto Embarque'}
    ]
    this.getAllDistribution();
    this.countrySelect();
  }

  updateDistribution(distribution: DistributionCenter){
    this.distributionCenter = distribution;
    this.loadingDistribution =true;
    setTimeout(() => {this.displayAddEdit = true}, 1000);
    this.loadingDistribution =false;
  }

  addUpdate() {    
    this.displayAddEdit = true;
  }

  closeAddEdit() {
    this.distributions = [];
    this.displayAddEdit = false;
    this.distributionCenter = null;
    setTimeout(() => {this.getAllDistribution();}, 1000);
    
  }

  countrySelect() {
    this.countryService.get().subscribe(data => {
      this.countryItems = data.map(r => (       
        { label: r.name, value: r.countryCode}
      ));
    });
  }
}
