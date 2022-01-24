
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuControllerService } from '../services/menu-controller.service';

@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(private menuServices: MenuControllerService, private router: Router, private http: HttpClient, public messageServices: MessageService) { }
    getLogin(username: string, password: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
                'Authorization': 'Basic ' + btoa(`HDM_Honda:HDM_Honda_Secret_2021`)
            })
        };
        const params = new HttpParams({
            fromObject: {
                grant_type: 'password',
                username: username,
                password: password,
            }
        });
        return this.http.post<any>(`${environment.apiUrlSecurity}`, params.toString(), httpOptions);
    }

    login(username: string, password: string) {
        this.getLogin(username, password).subscribe(response => {
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('token', response.access_token);
            localStorage.setItem("fullname", response.fullName);
            this.router.navigate(["/"]);
            this.convertMenu();
            this.messageServices.add({ key: 'error', severity: 'success', summary: "Bienvenido", detail: `${response.fullName}` });
        });
    }

    logout(): void {
        localStorage.setItem("isLoggedIn", 'false');
        localStorage.removeItem('token');
        localStorage.removeItem("fullname");
        localStorage.removeItem("authorities");
        sessionStorage.clear();
        this.router.navigateByUrl("/login");
    }

    convertMenu() {
        this.menuServices.get().subscribe(response => {
            let menuData = response.view;
            menuData = menuData.map(view => ({
                label: view.view, routerLink: [`/${view.route}`]
            }));
            sessionStorage.setItem("menu", JSON.stringify(menuData));

            let actionData = response.view;
            actionData = actionData.map(action => ({
                authority: action.route, can: [action.action]
            }));
            localStorage.setItem("authorities", JSON.stringify(actionData));
        });
    }
} 