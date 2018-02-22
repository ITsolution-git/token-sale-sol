import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgSpinningPreloader } from 'ng2-spinning-preloader';
import { ModalModule } from 'ngx-bootstrap';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { SimpleNotificationsModule } from 'angular2-notifications-lite';
import { IntercomModule } from 'ng-intercom';

import { AuthGuard } from './shared';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiRoutingService } from './core/api-routing.service';
import { LayoutModule } from './pages/layout/layout.module';
import { AuthService } from './core/services/auth.service';
import { HttpHelperService } from './core/http-helper.service';

import { LockedModalComponent } from './shared/components/locked-modal/locked-modal.component';
import { InstallMaskModalComponent } from './shared/components/install-mask-modal/install-mask-modal.component';
import { ValidNetworkModalComponent } from './shared/components/valid-network/valid-network.component';

import { INITIAL_APPLICATION_STATE } from './store/application-state';
import { userReducer } from './store/reducers/user.reducer';
import { WaitingTreasureModalComponent } from './shared/components/waiting-treasure-modal/waiting-treasure-modal.component';
import { WaitingItemComponent } from './shared/components/waiting-item/waiting-item.component';
import { TreasureModalComponent } from './shared/components/opening-treasure-modal/opening-treasure-modal.component';


export const reducers = {
  userState: userReducer
};

@NgModule({
  declarations: [
    AppComponent,
    LockedModalComponent,
    InstallMaskModalComponent,
    ValidNetworkModalComponent,
    WaitingTreasureModalComponent,
    WaitingItemComponent,
    TreasureModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    Ng2Webstorage,
    LayoutModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule.forRoot(),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({maxAge: 25}),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics, Angulartics2GoogleTagManager]),
    IntercomModule.forRoot()
  ],
  providers: [
    HttpHelperService,
    ApiRoutingService,
    AuthGuard,
    AuthService,
    NgSpinningPreloader
  ],
  entryComponents: [
    LockedModalComponent,
    InstallMaskModalComponent,
    ValidNetworkModalComponent,
    WaitingTreasureModalComponent,
    WaitingItemComponent,
    TreasureModalComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
