import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private tokenService: TokenService) { }
    //Intercepte chaque requête HTTP sortante pour y ajouter automatiquement le header Authorization: Bearer <token>
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.tokenService.getToken();

        if (token) {
            if (!this.tokenService.isTokenExpired(token)) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`  //ajout du token dans l'en-tête de la requête
                    }
                });
            } else {
                // Token expired, let it fail or handle refresh logic here (not implemented for now)
                // Usually we would try to refresh or just let 401 happen which logs user out
            }
        }

        return next.handle(request);
    }
}
