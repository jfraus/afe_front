import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';

@Injectable()
export class Hj2Service {
  constructor(private http: HttpClient) {  }

  getPaymentMethods(){
    return this.http.get<Hj2Invoice[]>(`${environment.apiUrl}hj2/by-invoice`).pipe();
  }

}