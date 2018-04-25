import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { HomeModule } from './home/home.module';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => LoginModule
  },
  // {
  //   path: 'forgetpassword',
  //   loadChildren: 'app/pages/forget-password/forget-password.module#ForgetPasswordModule',
  // },
  {
    path: 'registration',
    loadChildren: () => RegistrationModule
  },
  // {
  //   path: 'newregister',
  //   loadChildren: 'app/pages/register/newregister.module#NewRegisterModule',
  // },
  // {
  //   path: 'newuser',
  //   loadChildren: 'app/pages/register/newuser.module#NewUserModule',
  // },
  // {
  //   path: 'newregister',
  //   loadChildren: 'app/pages/register/newregister.module#NewRegisterModule',
  // },
  // {
  //   path: 'resetpassword',
  //   loadChildren: 'app/pages/reset-password/reset-password.module#ResetPasswordModule',
  // },
  // {
  //   path: 'termsandcondition',
  //   loadChildren: 'app/pages/termsandcondition/termsandcondition.module#TermsAndConditionModule',
  // },
  {
    path: 'pages',
    component: Pages,
    children: [
       { path: 'home', loadChildren: ()=> HomeModule },
       { path: '', loadChildren: ()=> HomeModule },
      // { path: 'cart-management', loadChildren: './cart-management/cart-management.module#CartManagementModule' },
      // { path: 'feedback', loadChildren: './day-end/day-end.module#DayEndModule' },
      // { path: 'history', loadChildren: './history/history.module#HistoryModule' },
      // { path: 'user-management', loadChildren: './user-management/user-management.module#TrackerModule' }
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
