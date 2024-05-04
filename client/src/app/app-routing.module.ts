import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authRouter } from "./auth/auth.routing";
import { homeRouter } from "./home/home.routing";

const routes: Routes = [authRouter, homeRouter, { path: "**", redirectTo: "/", pathMatch: "full" }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
