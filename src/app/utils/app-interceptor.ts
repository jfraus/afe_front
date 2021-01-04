import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ErrorToastService } from "./app-error-toast.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private aut: AuthService,private router: Router, public servicesError: ErrorToastService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.headers.get("Content-Type") !== 'application/x-www-form-urlencoded'){
            request = request.clone({headers: request.headers.set('Content-Type','application/json'), withCredentials: true});
            request = request.clone({headers: request.headers.set('Authorization',`Bearer ${localStorage.getItem("token")}`), withCredentials: true});
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        //Invalid token
                        this.servicesError.errorToken();
                        this.aut.logout();
                        this.router.navigateByUrl('/accessdenied');
                        return throwError(error)
                    } else {
                        this.servicesError.executeError(error);
                    }
                    return throwError(error)
                })
            );
        }else{
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        //Invalid token
                        this.servicesError.errorToken();
                        this.aut.logout();
                        this.router.navigateByUrl('/accessdenied');
                        return throwError(error)
                    } else {
                        this.servicesError.executeError(error);
                    }
                    return throwError(error)
                })
            );
        }
    }
}