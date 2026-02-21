import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Get expected role from route data
    const expectedRole = route.data['role'];

    if (!authService.isAuthenticated()) {
        router.navigate(['/auth/login']);
        return false;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.role === expectedRole) {
        return true;
    }

    // Not authorized
    // Optionally redirect to a forbidden page or root
    router.navigate(['/']);
    return false;
};
