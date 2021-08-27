import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Port } from '../models/port.model';

@Injectable()
export class PortControllerService {
  
  constructor(private http: HttpClient) {  }

  getPort(): Observable<Port[]>{
      return this.http.get<Port[]>(`${environment.apiUrl}port/`).pipe();
  }

  postPort(port: Port) {
    return this.http.post<any>(`${environment.apiUrl}port/`, port).pipe();
  }

  putPort(port: Port) {
     return this.http.put<any>(`${environment.apiUrl}port/`, port).pipe();
  }

}