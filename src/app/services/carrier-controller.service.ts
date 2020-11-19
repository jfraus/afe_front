import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';
import { FormatDate } from '../utils/format-date';

@Injectable()
export class CarrierControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(carrierType){
      return this.http.get<any>(`${environment.apiUrl}carrier/?carrierType=${carrierType}`).pipe();
    }
    
}