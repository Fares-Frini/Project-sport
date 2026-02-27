import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'auth-token';

    constructor() { }
    //Gère uniquement le stockage du JWT dans le localStorage et son décodage pour lire les rôles
    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    decodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (e) {
            return null;
        }
    }

    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        const expirationDate = decoded.exp * 1000;
        return Date.now() > expirationDate;
    }
}
