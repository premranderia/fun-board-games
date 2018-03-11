import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CodeNameComponent } from './component/code-name.component';
const appRoutes: Routes = [
  { path: '', component: CodeNameComponent },
  { path: '/:id', component: CodeNameComponent },
  {
    path: '/:id/spy', component: CodeNameComponent, data: {
      spyView: true
    }
  },
];
@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(
    appRoutes,
    { enableTracing: true } // <-- debugging purposes only
  )],
  declarations: [AppComponent, CodeNameComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
