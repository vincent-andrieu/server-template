import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { SnackbarService } from "./snackbar.service";

export const authProviders = ["google", "discord"] as const;
export type AuthProvider = (typeof authProviders)[number];

@Injectable({
    providedIn: "root"
})
export class AuthService {
    constructor(
        private readonly _http: HttpClient,
        private readonly _snackbarService: SnackbarService
    ) {}

    async isAuthenticated(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._http.get("/auth", { withCredentials: true, responseType: "text" }).subscribe({
                complete() {
                    resolve(true);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status >= 400 && error.status < 500) {
                        resolve(false);
                    } else {
                        this._snackbarService.openError(error);
                        reject(error);
                    }
                }
            });
        });
    }

    login(provider: AuthProvider) {
        window.location.href = `/auth/${provider}/login`;
    }

    async logout(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._http.put("/auth/logout", undefined, { withCredentials: true }).subscribe({
                complete() {
                    resolve();
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        resolve();
                    } else {
                        this._snackbarService.openError(error);
                        reject(error);
                    }
                }
            });
        });
    }
}
