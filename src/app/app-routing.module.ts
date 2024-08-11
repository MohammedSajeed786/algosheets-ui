import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { ProblemsComponent } from './components/problems/problems.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[authGuard]
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[authGuard]
    
  },
  {
    path:'problems/:name',
    component:ProblemsComponent,
    canActivate:[authGuard]
  },
  {
    path:'**',
    redirectTo:'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
