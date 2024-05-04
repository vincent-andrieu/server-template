import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatIconModule, RouterModule]
})
export class HomeModule {}
