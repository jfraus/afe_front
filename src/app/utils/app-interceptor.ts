import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ErrorToastService } from "./app-error-toast.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public servicesError: ErrorToastService){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        //Example inject headers
        if(request.headers.get("Content-Type") !== 'application/x-www-form-urlencoded'){
            request = request.clone({headers: request.headers.set('Content-Type','application/json'),withCredentials: true});
            request = request.clone({headers: request.headers.set('Authorization',`Bearer ${localStorage.getItem("token")}`),withCredentials: true});
        }else{
            return next.handle(request).pipe(
                //You will need to handle the api reponse this is exmaple
                map((event: HttpEvent<any>) => {
                    if(event instanceof HttpResponse){
                    }
                    return event;
                }),
                //You will need to handle the error this is exmaple
                catchError((error: HttpErrorResponse) => {
                    
                    this.servicesError.errorLogin();
                    return throwError(error)
                })
            );
        }
        return next.handle(request).pipe(
            //You will need to handle the api reponse this is exmaple
            map((event: HttpEvent<any>) => {
                if(event instanceof HttpResponse){
                }
                return event;
            }),
            //You will need to handle the error this is exmaple
            catchError((error: HttpErrorResponse) => {
                this.servicesError.executeError(error);
                return throwError(error)
            })
        );
    }
}
