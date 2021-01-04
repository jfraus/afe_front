import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
 
 
@Injectable({providedIn: "root"})
export class AuthGuardService implements CanActivate {
 
    constructor(private router: Router, public AuthService:AuthService) {        
    }
    
    public isLoggedIn():boolean {        
        return localStorage.getItem('isLoggedIn') == "true" ? true : false;      
    }    
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
        if (!this.isLoggedIn())  {
            //redirect to login/home page etc
            //return false to cancel the navigation
            this.router.navigateByUrl('/accessdenied');
            return false;
        } 
        return true;
    }
}
 