import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';
import { FormatDate } from '../utils/format-date';

@Injectable()
export class DistributionControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  get(dealerId,countryId){
      return this.http.get<any>(`${environment.apiUrl}distribution/?countryId=${countryId}&dealerId=${dealerId}`).pipe();
    }
  

}