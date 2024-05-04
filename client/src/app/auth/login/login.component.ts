import { Component } from "@angular/core";
import { AuthProvider, AuthService, authProviders } from "@services/auth.service";

type ProviderButton = {
    label: string;
    name: AuthProvider;
    icon: string;
    height: number;
    width: number;
};

@Component({
    selector: "app-auth-login",
    templateUrl: "./login.component.html"
})
export class AuthLoginComponent {
    public authProviders: Array<ProviderButton> = this._getProvidersButton();

    constructor(public authService: AuthService) {}

    private _getProvidersButton(): Array<ProviderButton> {
        return authProviders.map((provider) => {
            switch (provider) {
                case "discord":
                    return {
                        label: "Discord",
                        name: provider,
                        icon: `assets/icons/${provider}.svg`,
                        height: 40,
                        width: 40
                    };

                default:
                    return {
                        label: provider.charAt(0).toUpperCase() + provider.slice(1),
                        name: provider,
                        icon: `assets/icons/${provider}.svg`,
                        height: 24,
                        width: 24
                    };
            }
        });
    }
}
