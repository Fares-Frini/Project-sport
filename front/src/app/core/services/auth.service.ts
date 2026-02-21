import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.models';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private router: Router
    ) {
        this.initializeUser();
    }

    private initializeUser(): void {
        const token = this.tokenService.getToken();
        if (token && !this.tokenService.isTokenExpired(token)) {
            const decoded: any = this.tokenService.decodeToken(token);
            if (decoded) {
                // .NET ClaimTypes map to these URIs in JWT
                const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
                const emailClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
                const idClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

                const role = decoded[roleClaimKey] || decoded.role || 'User';
                this.currentUserSubject.next({
                    id: decoded[idClaimKey] || decoded.sub || decoded.nameid,
                    email: decoded[emailClaimKey] || decoded.email || decoded.unique_name,
                    role: role as 'Admin' | 'User'
                } as User);
            } else {
                this.tokenService.removeToken();
            }
        } else {
            this.tokenService.removeToken();
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.tokenService.saveToken(response.token);
                this.initializeUser();
            })
        );
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, data);
    }

    logout(): void {
        this.tokenService.removeToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getToken();
        return !!token && !this.tokenService.isTokenExpired(token);
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === 'Admin';
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
