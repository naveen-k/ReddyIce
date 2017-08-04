import { HomeComponent } from './home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
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
