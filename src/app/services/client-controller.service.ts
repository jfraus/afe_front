import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Client } from '../models/client.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class ClientService {
  constructor(private http: HttpClient) {  }

  getClients(): Observable<Client[]>{
      return this.http.get<Client[]>(`${environment.apiUrl}client/`).pipe();
  }

  postClient(client:Client){
    return this.http.post<any>(`${environment.apiUrl}client/`,client).pipe();
  }

  getClient(id : number) : Observable<Client>{
    return this.http.get<Client>(`${environment.apiUrl}client/?id=${id}`).pipe();
  }

  putClient(client:Client){
    return this.http.put<any>(`${environment.apiUrl}client/`,client).pipe();
  }
  
}