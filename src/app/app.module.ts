import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { TranslateService } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { routing } from './app.routing';

// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { PagesModule } from './pages/pages.module';
import { CacheService } from './shared/cache.service';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    routing,
    MaterialModule,
    SimpleNotificationsModule.forRoot(),
    FlexLayoutModule,
  ],
  providers: [AppState,GlobalState,CacheService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(public appState: AppState) {
  }
}
