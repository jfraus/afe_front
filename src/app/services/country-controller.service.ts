import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';

@Injectable()
export class CountryControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(){
      return this.http.get<any>(`${environment.apiUrl}country/`).pipe();
    }
  

}