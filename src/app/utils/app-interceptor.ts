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
        request = request.clone({headers: request.headers.set('Content-Type','application/json')});

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
