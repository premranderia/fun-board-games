import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CodeNameComponent } from './component/code-name.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home-component/home-component';
import { HomeRoutesComponent } from './routes/home-routes.component';
import { CodeNameRoutesComponent } from './routes/code-name-routes.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule, MatButtonModule } from '@angular/material';
// import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  declarations: [AppComponent, CodeNameComponent, HomeComponent, HomeRoutesComponent, CodeNameRoutesComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
