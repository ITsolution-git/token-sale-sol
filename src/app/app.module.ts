import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ApiRoutingService } from './core/api-routing.service';
import { LayoutModule } from './pages/layout/layout.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    Ng2Webstorage,
    LayoutModule,
  ],
  providers: [
    ApiRoutingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
