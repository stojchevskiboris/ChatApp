import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { MaterialModule } from './shared/angular-material/material.module';
import { AccountOverviewComponent } from './components/account-overview/account-overview.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatSettingsComponent } from './components/chat-settings/chat-settings.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { HeaderComponent } from './components/header/header.component'
import { ChatDatePipe } from './shared/pipes/chat-date.pipe';
import { LastActivePipe } from './shared/pipes/last-active.pipe';
import { NgScrollbarModule, provideScrollbarOptions } from 'ngx-scrollbar';
import { GifSearchComponent } from './components/gif-search/gif-search.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AccountOverviewComponent,
    ChatComponent,
    ChatSettingsComponent,
    AccountSettingsComponent,
    LeftPaneComponent,
    HeaderComponent,
    ChatDatePipe,
    LastActivePipe,
    GifSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgScrollbarModule
  ],
  providers: [
    DataService,
    AuthService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideScrollbarOptions({
      orientation: 'vertical',
      position: 'native',
      visibility: 'visible',
      // visibility: 'hover',
      appearance: 'native',
      buttons: false,
      trackClass: 'scrollbar-track',
      thumbClass: 'scrollbar-thumb',
    }),
    provideAnimationsAsync()
  ],
  exports: [
    MaterialModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }