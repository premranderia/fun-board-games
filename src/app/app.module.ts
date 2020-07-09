import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CodeNameComponent } from './component/code-name.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home-component/home-component';
import { HomeRoutesComponent } from './routes/home-routes.component';
import { LinkeeHomeRoutesComponent } from './routes/linkee-home-routes.component';
import { CodeNameRoutesComponent } from './routes/code-name-routes.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSlideToggleModule,
  MatButtonModule,
  MatInputModule,
} from '@angular/material';
import { LinkeeHomeComponent } from './linkee-home-component/linkee-home-component';
import { LinkeeGameRouteComponent } from './routes/linkee-game-routes.component';
import { LinkeeGameComponent } from './linkee/linkee-game.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [
    AppComponent,
    CodeNameComponent,
    HomeComponent,
    HomeRoutesComponent,
    CodeNameRoutesComponent,
    LinkeeHomeRoutesComponent,
    LinkeeHomeComponent,
    LinkeeGameRouteComponent,
    LinkeeGameComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
