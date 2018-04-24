import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppRoutingModule} from './app.routing.module';
import { TranslateService } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { routing } from './app.routing';

// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { PagesModule } from './pages/pages.module';
import { CacheService } from './shared/cache.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
