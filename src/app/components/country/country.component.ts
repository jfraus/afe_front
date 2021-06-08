import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CountryControllerService } from 'src/app/services/country-controller.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [CountryControllerService]
})
export class CountryComponent implements OnInit {

  cols = [];
  countries = [];
  loadingCountries = false;

  constructor(private countryController: CountryControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'countryCode', header: 'Código de pais'},
      {field: 'globalCode', header: 'Código Global'},
      {field: 'isoCode', header: 'Código ISO'},
      {field: 'name', header: 'Pais'},
      {field: 'cofidiCode', header: 'Clave COFIDI'}
    ]
    this.searchCountries();
  }

  searchCountries(): void {
    this.countryController.get().subscribe(data => {
      this.countries = data;
      console.log(JSON.stringify(data));
      
    });
  }

  updateCountry(): void {
    
  }
}
