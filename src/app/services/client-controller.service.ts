import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Client } from '../models/client.model';

@Injectable()
export class ClientService {

  constructor(private http: HttpClient) {  }

  getClients(){
      return this.http.get<Client[]>(`${environment.apiUrl}client/`).pipe();
  }
  
}