import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { port } from '../models/port.model';

@Injectable()
export class PortControllerService {
  constructor(private http: HttpClient) {  }

    getClients(): Observable<port[]>{
        return this.http.get<port[]>(`${environment.apiUrl}port/`).pipe();
    }

}