import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class RoleControllerService {
    constructor(private http: HttpClient) {  }

    getAllRoles(): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}role/`).pipe();
    }
}