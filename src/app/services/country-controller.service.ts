import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';
import { Country } from '../models/country.model';

@Injectable()
export class CountryControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(){
      return this.http.get<any>(`${environment.apiUrl}country/`).pipe();
  }

  getExportCountries(){
    return this.http.get<any>(`${environment.apiUrl}country/get-countries-export`).pipe();
}
    
  put(country: Country) {
    return this.http.put<Country>(`${environment.apiUrl}country/`, country).pipe();
  }
}