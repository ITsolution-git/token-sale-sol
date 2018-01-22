import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthGuard } from './shared';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ApiRoutingService } from './core/api-routing.service';
import { LayoutModule } from './pages/layout/layout.module';
import { AuthService } from './core/services/auth.service';
import { HttpHelperService } from './core/http-helper.service';

import { INITIAL_APPLICATION_STATE } from './store/application-state';

import { userReducer } from './store/reducers/user.reducer';

export const reducers = {
  userState: userReducer
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    Ng2Webstorage,
    LayoutModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({maxAge: 25}),
  ],
  providers: [
    HttpHelperService,
    ApiRoutingService,
    AuthGuard,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
