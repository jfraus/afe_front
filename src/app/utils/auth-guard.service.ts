import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
 
 
@Injectable({providedIn: "root"})
export class AuthGuardService implements CanActivate {
 
    constructor(private router: Router, public AuthService:AuthService) {
        
    }
    public isLoggedIn(): boolean {      
        let status = false;      
        if (localStorage.getItem('isLoggedIn') == "true") {      
           status = true;      
        }    
        else {      
           status = false;      
           }      
        return status;      
        }    
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
 
        //check some condition  

        if (!this.isLoggedIn())  {
            
            //redirect to login/home page etc
            //return false to cancel the navigation
            this.router.navigateByUrl('/accessdenied');

            return false;
        } 
        
        return true;
    }
 
}
 