import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({ providedIn: "root" })
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, public AuthService: AuthService) {
    }

    public isLoggedIn(): boolean {
        return localStorage.getItem('isLoggedIn') == "true" ? true : false;
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        if (!this.isLoggedIn() || !this.checkPermissions(state)) {
            //redirect to login/home page etc
            //return false to cancel the navigation
            if (state.url === "/") {
                this.router.navigateByUrl('/login');
                return false;
            }
            this.router.navigateByUrl('/accessdenied');
            return false;
        }
        return true;
    }

    public checkPermissions(state): boolean {
        let menu = JSON.parse(sessionStorage.getItem("menu"));
        if (state.url === "/") {
            return true;
        } else {
            if (menu.find(element => element.routerLink[0] === state.url)) {
                return true;
            }
        }
        sessionStorage.setItem("permRouter", "false");
        return false;
    }
}
