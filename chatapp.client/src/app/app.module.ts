import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ChatDatePipe } from './shared/pipes/chat-date.pipe';
import { LastActivePipe } from './shared/pipes/last-active.pipe';
import { NgScrollbarModule, provideScrollbarOptions } from 'ngx-scrollbar';
import { GifSearchComponent } from './components/gif-search/gif-search.component';
import { AddContactDialogComponent } from './components/dialogs/add-contact-dialog/add-contact-dialog.component';
import { SignOutDialogComponent } from './components/dialogs/sign-out-dialog/sign-out-dialog.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { RemoveContactDialogComponent } from './components/dialogs/remove-contact-dialog/remove-contact-dialog.component';
import { DatePipe } from '@angular/common';
import { RemoveMediaDialogComponent } from './components/dialogs/remove-media-dialog/remove-media-dialog.component';
import { MediaPreviewDialogComponent } from './components/dialogs/media-preview-dialog/media-preview-dialog.component';
import { MessageDatePipe } from './shared/pipes/message-date.pipe';
import { SignalRService } from './services/signalr.service';
import { TimeStampLocalePipe } from './shared/pipes/time-stamp-locale.pipe';
import { DateTimeLocalePipe } from './shared/pipes/date-time-locale.pipe';
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
    ChatDatePipe,
    LastActivePipe,
    MessageDatePipe,
    GifSearchComponent,
    AddContactDialogComponent,
    SignOutDialogComponent,
    ContactsComponent,
    RemoveContactDialogComponent,
    RemoveMediaDialogComponent,
    RemoveMediaDialogComponent,
    MediaPreviewDialogComponent,
    TimeStampLocalePipe,
    DateTimeLocalePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgScrollbarModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    DatePipe,
    DataService,
    AuthService,
    UserService,
    SignalRService,
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
    provideAnimationsAsync(),
    provideToastr({
      tapToDismiss: true,
      closeButton: true,
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      includeTitleDuplicates: true,
      newestOnTop: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      timeOut: 4000,
      extendedTimeOut: 3000,
      disableTimeOut: false,
      easeTime: 200,
      positionClass: 'toast-bottom-center',
    })
  ],
  exports: [
    MaterialModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }