import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//Protège les routes nécessitant une authentification.
export const authGuard: CanActivateFn = (route, state) => { //Fonction de garde pour protéger les routes nécessitant une authentification
    const authService = inject(AuthService); //Injecte le service d'authentification
    const router = inject(Router); //Injecte le service de routage

    if (authService.isAuthenticated()) { //Vérifie si l'utilisateur est authentifié
        return true; //Retourne true si l'utilisateur est authentifié
    }

    // Redirection vers la page de connexion avec l'URL de retour
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } }); //Redirige vers la page de connexion avec l'URL de retour
};
