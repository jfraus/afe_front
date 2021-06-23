import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Ramp } from '../models/ramp.model';

@Injectable({
  providedIn: 'root'
})
export class RampsControllerService {

  constructor(private http: HttpClient) {  }

  get(){
    return this.http.get<Ramp[]>(`${environment.apiUrl}ramps/`).pipe();
  }
}
