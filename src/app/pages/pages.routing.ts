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
  {
    path: 'resetpassword',
    loadChildren: ()=>{
      return <any>import('./reset/reset.module')
        .then(({ ResetModule }) => ResetModule)
      }
  },
  {
    path: 'forgotpassword',
    loadChildren: ()=>{
      return <any>import('./forgotPassword/forgotPassword.module')
        .then(({ ForgotPasswordModule }) => ForgotPasswordModule)
      }
  },
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
        { path: 'quickorder',  loadChildren: ()=>{
          return <any>import('./quickOrder/quickOrder.module')
            .then(({ QuickOrderModule }) => QuickOrderModule)
          }
        },  
        { path: 'changepassword',  loadChildren: ()=>{
          return <any>import('./changePassword/changePassword.module')
            .then(({ ChangePasswordModule }) => ChangePasswordModule)
          }
        },  
        { path: 'profile',  loadChildren: ()=>{
          return <any>import('./profile/profile.module')
            .then(({ ProfileModule }) => ProfileModule)
          }
        },  
        { path: 'cart',  loadChildren: ()=>{
          return <any>import('./cart/cart.module')
            .then(({ CartModule }) => CartModule)
          }
        }               
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
