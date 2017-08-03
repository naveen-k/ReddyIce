import { Routes, Router, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: HomeComponent }];


@NgModule({
    declarations: [HomeComponent],
    imports: [ RouterModule.forChild(routes) ]
})
export class HomeModule {

}
