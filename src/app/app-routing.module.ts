import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CodeNameComponent } from './component/code-name.component';
import { HomeRoutesComponent } from './routes/home-routes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeRoutesComponent },
  {
    path: 'game',
    component: CodeNameComponent,

  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }