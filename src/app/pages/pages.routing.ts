import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: ()=>{
      return <any>import('./login/login.module')
        .then(({ LoginModule }) => LoginModule)
      }
  },
  // {
  //   path: 'forgetpassword',
  //   loadChildren: 'app/pages/forget-password/forget-password.module#ForgetPasswordModule',
  // },
  {
    path: 'registration',
    loadChildren: ()=>{
      return <any>import('./registration/registration.module')
        .then(({ RegistrationModule }) => RegistrationModule)
      }
  },
  {
    path: 'newuser',
    loadChildren: ()=>{
      return <any>import('./newuser/newuser.module')
        .then(({ NewUserModule }) => NewUserModule)
      }
  },
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
       { path: 'home', loadChildren: ()=>{
        return <any>import('./home/home.module')
          .then(({ HomeModule }) => HomeModule)
        }
       },
       { path: '',  loadChildren: ()=>{
          return <any>import('./home/home.module')
            .then(({ HomeModule }) => HomeModule)
          }
        },
      // { path: 'cart-management', loadChildren: './cart-management/cart-management.module#CartManagementModule' },
      // { path: 'feedback', loadChildren: './day-end/day-end.module#DayEndModule' },
      // { path: 'history', loadChildren: './history/history.module#HistoryModule' },
      // { path: 'user-management', loadChildren: './user-management/user-management.module#TrackerModule' }
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
