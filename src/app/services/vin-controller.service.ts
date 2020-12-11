import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormatDate } from '../utils/format-date';

@Injectable({
  providedIn: 'root'
})
export class VinControllerService {

  constructor(private http: HttpClient, public dateUtils: FormatDate) { }
  getReportORderByVin(id){
    return this.http.get<any>(`${environment.apiUrl}vin/report-orderbyvin?id=${id}`).pipe();
  }

  sendYms(){
    return this.http.post<string>(`${environment.apiUrl}order-by-vin`,null).pipe();
  }

}
