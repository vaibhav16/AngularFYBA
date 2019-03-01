import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { HttpRequest } from "selenium-webdriver/http";
import { Observable } from "rxjs";
import { Response } from "@angular/http";

// @Injectable()
// export class Interceptor implements HttpInterceptor{
//     intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{

//        return next.handle(req);

//     }
// }