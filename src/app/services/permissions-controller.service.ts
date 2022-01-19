import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class PermissionsController {

    constructor(private http: HttpClient) {}

    getFilesystem() {
        return this.http.get<any>(`${environment.apiUrl}permissions/`).pipe();
    }

    getActionsByRole(roleId: number) {
        return this.http.get<any>(`${environment.apiUrl}permissions/byRole/?roleId=${roleId}`).pipe();
    }
}