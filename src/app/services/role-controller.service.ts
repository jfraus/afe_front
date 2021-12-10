import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { Roles } from '../models/roles.model'; 

@Injectable()
export class RoleControllerService {
    constructor(private http: HttpClient) {  }

    getAllRoles(): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}role/`).pipe();
    }

    saveRole(role: Roles):  Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}role/`, role).pipe();
    }

    geRoleById(id: any): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}role/getRoleById?id=${id}`).pipe();
    }

    updateRole(role: Roles):  Observable<any>{
        return this.http.put<any>(`${environment.apiUrl}role/`, role).pipe();
    }
}