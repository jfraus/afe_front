import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';
import { DistributionCenter } from '../models/distributionCenter.model';

@Injectable()
export class DistributionControllerService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

  getAll(){
    return this.http.get<any>(`${environment.apiUrl}/all-distribution`).pipe();
  }

  get(dealerId,countryId){
      return this.http.get<any>(`${environment.apiUrl}distribution/?countryId=${countryId}&dealerId=${dealerId}`).pipe();
    }
  
  post(distributionCenter: DistributionCenter){
    return this.http.post<any>(`${environment.apiUrl}distribution`, distributionCenter).pipe(); 
  }
}