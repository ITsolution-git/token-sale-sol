import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AuthGuard } from './shared';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ApiRoutingService } from './core/api-routing.service';
import { LayoutModule } from './pages/layout/layout.module';
import { AuthService } from './core/services/auth.service';
import { HttpHelperService } from './core/http-helper.service';

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
    Ng4LoadingSpinnerModule,
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
