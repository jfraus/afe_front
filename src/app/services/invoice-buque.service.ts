import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Buque } from '../models/buque.model';

@Injectable()
export class InvoiceBuqueService {

  constructor(private http: HttpClient) { }

  getBuques() {
    return this.http.get<Buque[]>(`${environment.apiUrl}`).pipe();
  }
}
