import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
 
 
@Injectable()
export class AuthGuardService implements CanActivate {
 
    constructor(private router: Router) {
    }
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
 
        //check some condition  
        if (true)  {
            alert('You are not allowed to view this page');
            //redirect to login/home page etc
            //return false to cancel the navigation
            this.router.navigateByUrl('/accessdenied');

            return false;
        } 
        return true;
    }
 
}
 