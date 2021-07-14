import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class QuoteService {
  constructor(private http: HttpClient) {  }

  getAllQuotes(date: string): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}quote/?date=${date}`).pipe();
  }

}