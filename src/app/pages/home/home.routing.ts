import { HomeComponent } from './';
import { DashboardComponent } from './components/dashboard';
import { Routes, RouterModule } from '@angular/router';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
];

export const homeRouting = RouterModule.forChild(routes);
