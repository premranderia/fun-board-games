import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './routes/route.constant';
import { CodeNameComponent } from './component/code-name.component';
import { HomeRoutesComponent } from './routes/home-routes.component';

const routes: Routes = [
  { path: ROUTES.HOME, pathMatch: 'full', component: HomeRoutesComponent },
  {
    path: ROUTES.GAME,
    component: CodeNameComponent,

  },
  { path: ROUTES.ANY, redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }