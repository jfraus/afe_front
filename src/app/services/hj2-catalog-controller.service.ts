import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class Hj2Service {
  constructor(private http: HttpClient) {  }

}