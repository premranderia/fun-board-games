import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CodeNameComponent } from './component/code-name.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: CodeNameComponent },
  {
    path: 'game',
    component: CodeNameComponent,
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [AppComponent, CodeNameComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
