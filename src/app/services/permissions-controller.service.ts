import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { RoleAction } from "../models/roleAction.model";

@Injectable()
export class PermissionsController {

    constructor(private http: HttpClient) {}

    getFilesystem() {
        return this.http.get<any>(`${environment.apiUrl}permissions/`).pipe();
    }

    getActionsByRole(roleId: number) {
        return this.http.get<any>(`${environment.apiUrl}permissions/byRole/?roleId=${roleId}`).pipe();
    }
    
    postSaveActionsByRole(roleAction: RoleAction) {
        return this.http.post<any>(`${environment.apiUrl}permissions/`, roleAction).pipe();
    }

    deleteSaveActionsByRole(viewId: number, roleId: number, viewActionid: number) {
        return this.http.delete<any>(`${environment.apiUrl}permissions/${roleId}/${viewId}/${viewActionid}`).pipe();
    }
}