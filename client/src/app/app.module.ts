import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { BrowserModule, provideClientHydration } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { environment } from "@environment";
import { BaseUrlInterceptor } from "@interceptors/baseUrl.interceptor";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, AuthModule],
    providers: [
        provideAnimationsAsync(),
        provideClientHydration(),
        provideHttpClient(withFetch()),
        { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
        { provide: "BASE_API_URL", useValue: environment.apiUrl },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "outline" } },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
