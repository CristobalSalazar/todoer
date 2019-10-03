import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { TodosListComponent } from './components/todos-list/todos-list.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoTabsComponent } from './components/todo-tabs/todo-tabs.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ActiveTodosPipe } from './Pipes/active-todos.pipe';
import { TodosPageComponent } from './components/todos-page/todos-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosListComponent,
    TodoItemComponent,
    AddTodoComponent,
    TodoTabsComponent,
    HomeComponent,
    NavbarComponent,
    ActiveTodosPipe,
    TodosPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
