import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    if (authService.isAuthenticated() && !authService.isTokenExpired()) {
        return true;
    }
    authService.logout();
    router.navigate(['/login']);
    return false;
};