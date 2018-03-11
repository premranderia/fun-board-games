import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CodeNameComponent } from './component/code-name.component';

const appRoutes: Routes = [
  // { path: '', redirectTo: 'game/-1' },
  { path: 'game/:id', component: CodeNameComponent },
  {
    path: 'spy/:id', component: CodeNameComponent,
    data: {
      spyView: true
    },
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(
    appRoutes // <-- debugging purposes only
  )],
  declarations: [AppComponent, CodeNameComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
