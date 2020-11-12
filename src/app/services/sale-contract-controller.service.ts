import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';
import { FormatDate } from '../utils/format-date';

@Injectable()
export class SaleContractControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(contractNumber: string,createDateFrom: string,createDateTo: string){
      if(contractNumber && createDateFrom && createDateTo){
          return this.http.get<any>(`${environment.apiUrl}sale/contracts/?contractNumber=${contractNumber}&createDateFrom=${createDateFrom}&createDateFrom=${createDateTo}`).pipe();
      }
      if(contractNumber){
        return this.http.get<any>(`${environment.apiUrl}sale/contracts/?contractNumber=${contractNumber}`).pipe();
      }
      if(createDateFrom && createDateTo){
        return this.http.get<any>(`${environment.apiUrl}sale/contracts/?createDateFrom=${this.dateUtils.formatDate(createDateFrom)}&createDateTo=${this.dateUtils.formatDate(createDateTo)}`).pipe();
      }
      return this.http.get<any>(`${environment.apiUrl}sale/contracts/`).pipe();
      
    }

    post(selcContractDto){
      return this.http.post<any>(`${environment.apiUrl}sale/contracts/`,selcContractDto).pipe();
    }
  

}