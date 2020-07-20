import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './routes/route.constant';
import { CodeNameComponent } from './component/code-name.component';
import { HomeRoutesComponent } from './routes/home-routes.component';
import { LinkeeHomeRoutesComponent } from './routes/linkee-home-routes.component';
import { LinkeeGameComponent } from './linkee/linkee-game.component';
import { IndexRoutesComponent } from './routes/index-routes.component';

const routes: Routes = [
  {
    path: ROUTES.HOME,
    pathMatch: 'full',
    component: IndexRoutesComponent,
  },
  {
    path: ROUTES.CODE_NAME_HOME,
    component: HomeRoutesComponent,
  },
  {
    path: ROUTES.GAME,
    component: CodeNameComponent,
  },
  {
    path: ROUTES.CODE_NAME,
    component: CodeNameComponent,
  },
  {
    path: ROUTES.LINKEE_HOME,
    component: LinkeeHomeRoutesComponent,
  },
  {
    path: ROUTES.LINKEE_GAME,
    component: LinkeeGameComponent,
  },
  { path: ROUTES.ANY, redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
