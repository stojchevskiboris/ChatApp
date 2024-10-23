import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { MaterialModule } from './shared/angular-material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountOverviewComponent } from './components/account-overview/account-overview.component';
import { MessagesContactsComponent } from './components/messages-contacts/messages-contacts.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatSettingsComponent } from './components/chat-settings/chat-settings.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { HeaderComponent } from './components/header/header.component'
import { MatIconModule } from '@angular/material/icon';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingService } from './services/loading.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AccountOverviewComponent,
    MessagesContactsComponent,
    ChatComponent,
    ChatSettingsComponent,
    AccountSettingsComponent,
    LeftPaneComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  providers: [
    DataService,
    LoadingService,
    AuthService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
  ],
  exports: [
    MaterialModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
