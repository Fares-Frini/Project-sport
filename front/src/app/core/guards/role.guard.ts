import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
//Vérifie si l'utilisateur possède un rôle spécifique (ex: 'Admin') pour accéder aux pages d'administration.
//Protège les routes nécessitant un rôle spécifique.
export const roleGuard: CanActivateFn = (route, state) => { //Fonction de garde pour protéger les routes nécessitant un rôle spécifique
    const authService = inject(AuthService); //Injecte le service d'authentification
    const router = inject(Router); //Injecte le service de routage

    // Get expected role from route data //Récupère le rôle attendu depuis les données de la route
    const expectedRole = route.data['role']; //Récupère le rôle attendu depuis les données de la route

    if (!authService.isAuthenticated()) { //Vérifie si l'utilisateur est authentifié
        router.navigate(['/auth/login']); //Redirige vers la page de connexion
        return false; //Retourne false si l'utilisateur n'est pas authentifié
    }

    const currentUser = authService.getCurrentUser(); //Récupère l'utilisateur actuel
    if (currentUser && currentUser.role === expectedRole) { //Vérifie si l'utilisateur actuel a le rôle attendu
        return true; //Retourne true si l'utilisateur actuel a le rôle attendu
    }

    // Not authorized //Non autorisé
    // Optionally redirect to a forbidden page or root //Redirige vers une page d'interdiction ou la racine
    router.navigate(['/']); //Redirige vers la racine
    return false; //Retourne false si l'utilisateur n'a pas le rôle attendu
};
