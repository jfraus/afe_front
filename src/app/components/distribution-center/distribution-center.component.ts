import { Component, OnInit } from '@angular/core';
import { DistributionCenter} from 'src/app/models/distributionCenter.model';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service'
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-distribution-center',
  templateUrl: './distribution-center.component.html',
  styleUrls: ['./distribution-center.component.css'],
  providers:[DistributionControllerService]
})
export class DistributionCenterComponent implements OnInit {

  cols = [];
  loadingDistribution:boolean = false;
  distributions: DistributionCenter[] =[];
  displayAddEdit: boolean = false;

  constructor(private distributionControllerService :DistributionControllerService, private messageService :MessageService) { }

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
      {field: 'country', header: 'País'},
      {field: 'distributionCode', header: 'Código de Distribución'},
      {field: 'port', header: 'Puerto'},
      {field: 'portCode', header: 'Código de Puerto'}
    ]
    this.getAllDistribution();
  }

  updateDistribution(){

  }

  addUpdate() {
    console.log('clic');
    
    this.displayAddEdit = true;
  }


}
