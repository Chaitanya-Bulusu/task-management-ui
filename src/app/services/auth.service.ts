import { Injectable, Inject, PLATFORM_ID, OnDestroy } from "@angular/core";
import { AuthResponse, LoginRequest, RegisterRequest } from "../models/models";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, interval, Subject, takeUntil } from "rxjs";
import { API_CONSTANTS } from "../api.constants";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private tokenKey = 'authToken';
    private refreshToken = 'refreshToken';
    private destroy$ = new Subject<void>();

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
        this.startAutoRefresh();
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    private startAutoRefresh() {
        if (this.isBrowser()) {
            interval(60 * 60 * 1000) // 1 hour in ms
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.isAuthenticated() && this.getRefreshToken()) {
                        this.refreshToken$().subscribe({
                            error: () => this.clearTokens()
                        });
                    }
                });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    register(request: RegisterRequest): Observable<any> {
        return this.http.post(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.REGISTER}`, request);
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.LOGIN}`, request)
            .pipe(
                tap(response => {
                    if (response.token) {
                        if (this.isBrowser()) {
                            localStorage.setItem(this.tokenKey, response.token);
                            localStorage.setItem(this.refreshToken, response.refreshToken);
                        }
                    } else {
                        throw new Error('Invalid login response: missing token');
                    }
                })
            );
    }

    logout(): void {
        if (this.isBrowser()) {
            this.http.post(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.LOGOUT}`, {}).subscribe({
                next: () => this.clearTokens(),
                error: () => this.clearTokens()
            });
        };
    }

    getToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    getRefreshToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.refreshToken);
        }
        return null;
    }

    refreshToken$(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        return this.http.post<AuthResponse>(
            `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.AUTH.REFRESH}`,
            { refreshToken }
        ).pipe(
            tap(response => {
                if (response.token) {
                    if (this.isBrowser()) {
                        localStorage.setItem(this.tokenKey, response.token);
                        localStorage.setItem(this.refreshToken, response.refreshToken);
                    }
                } else {
                    this.clearTokens();
                    throw new Error('Invalid refresh response: missing token');
                }
            })
        );
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;
        try {
            const [, payload] = token.split('.');
            const { exp } = JSON.parse(atob(payload));
            return exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }

    clearTokens(): void {
        if (this.isBrowser()) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.refreshToken);
        }
    }
}



