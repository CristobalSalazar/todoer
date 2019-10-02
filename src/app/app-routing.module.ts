import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodosListComponent } from './components/todos-list/todos-list.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: 'todos',
    component: TodosListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
