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
    private currentUserSubject = new BehaviorSubject<User | null>(null); //stocke l'état de l'utilisateur actuel (currentUser$) via un BehaviorSubject
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient, //permet de faire des requêtes HTTP
        private tokenService: TokenService, //permet de gérer le token
        private router: Router //permet de naviguer entre les pages
    ) {
        this.initializeUser();
    }
    //permet la persistance de l'authentification même après un rafraîchissement de la page
    private initializeUser(): void {
        const token = this.tokenService.getToken(); //récuperer token  s'il exist dans le navigateur
        if (token && !this.tokenService.isTokenExpired(token)) { //Elle vérifie si le token n'est pas expiré.
            const decoded: any = this.tokenService.decodeToken(token); //décode le token
            if (decoded) {
                // .NET ClaimTypes map to these URIs in JWT
                const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'; //récuperer le role dans le token depuis .net
                const emailClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'; //récuperer l'email dans le token
                const idClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'; //récuperer l'id dans le token

                const role = decoded[roleClaimKey] || decoded.role || 'User';
                this.currentUserSubject.next({ //traduit les noms compliqués en noms simples (id, email, role) et met à jour l'état de l'utilisateur actuel
                    id: decoded[idClaimKey] || decoded.sub || decoded.nameid,
                    email: decoded[emailClaimKey] || decoded.email || decoded.unique_name,
                    role: role as 'Admin' | 'User'
                } as User);
            } else {
                this.tokenService.removeToken(); //supprimer le token s'il est invalide
            }
        } else {
            this.tokenService.removeToken(); //supprimer le token s'il est expiré
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe( //envoie une requête POST au serveur pour se connecter
            tap(response => { //après avoir reçu la réponse du serveur
                this.tokenService.saveToken(response.token); //stocker le token
                this.initializeUser(); //initialiser l'utilisateur
            })
        );
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, data); //envoie une requête POST au serveur pour s'inscrire
    }

    logout(): void {
        this.tokenService.removeToken(); //supprimer le token
        this.currentUserSubject.next(null); //supprimer l'utilisateur
        this.router.navigate(['/auth/login']); //redirection vers la page de connexion
    }

    isAuthenticated(): boolean {
        const token = this.tokenService.getToken(); //récuperer le token
        return !!token && !this.tokenService.isTokenExpired(token); //vérifier si le token n'est pas expiré
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value; //récuperer l'utilisateur actuel
        return user?.role === 'Admin'; //vérifier si l'utilisateur est admin
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value; //récuperer l'utilisateur actuel
    }
}
