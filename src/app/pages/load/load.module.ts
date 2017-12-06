import { BranchResolver} from './Load.resolver';
import { LoadPipe } from './components/load-list/load-list.pipe';
import { LoadComponent } from './components/load-list/load.component';
import { LoadContainerComponent } from './components/load-container/load-container.component';
import { DetailsComponent } from './components/load-details/details.component';

import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoadService } from './load.service';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
    {
        path: '',
        component: LoadContainerComponent,
        children: [{
            path: 'list',
            component: LoadComponent,
            resolve: {
                branches: BranchResolver,
              },
        },
        {
            path: 'detail',
            component: DetailsComponent,
            data:{
                LoadEditMode: false,
                LoadMode: false,
              },
        },
        {
            path: 'detail/:loadId',
            component: DetailsComponent,
            data:{
                LoadEditMode: true,
                LoadMode: true,
              },
        },
        {
            path: '', redirectTo: 'list', pathMatch: 'full',
        }],
    },
];

@NgModule({
    declarations: [LoadContainerComponent,
        LoadComponent,
        DetailsComponent,
        LoadPipe,
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        NgaModule,
        NgbModule,
        SharedModule,
    ],
    providers: [LoadService,BranchResolver],
})
export class LoadModule {
    
}
