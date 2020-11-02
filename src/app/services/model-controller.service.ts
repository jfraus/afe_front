import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class ModelControllerService {
  constructor(private http: HttpClient) {  }

  get(excludeModel: boolean){
          return this.http.get<any>(`${environment.apiUrl}models/?excludeModel=${excludeModel}`).pipe();
    }
  put(model){
    return this.http.put<any>(`${environment.apiUrl}models/exclud-model`,model).pipe();
  }

}