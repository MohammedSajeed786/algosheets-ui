import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './shared/components/error/error.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ProblemsComponent } from './components/problems/problems.component';
import { LoaderComponent } from './shared/components/loader/loader.component';




@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, ErrorComponent, ToastComponent, HeaderComponent, ProblemsComponent, LoaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
    ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
