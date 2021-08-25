import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';

@Injectable()
export class DealerControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(countryId: string){
      return this.http.get<any>(`${environment.apiUrl}dealer/?countryId=${countryId}`).pipe();
  }

  getDealersByCountry(countryId: string){
    return this.http.get<any[]>(`${environment.apiUrl}dealer/country/?countryCode=${countryId}`).pipe();
  }
}