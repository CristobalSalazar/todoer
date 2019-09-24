import { Component, OnInit } from '@angular/core';
import Todo from '../../interfaces/Todo';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, pipe } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  public display: Todo[] = [];
  private todos: Todo[] = [];
  private todos$: Observable<TodoModel>;
  constructor(
    private authService: AuthService,
    private ngFirestore: AngularFirestore,
    private ngAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      // create the observable;
      this.todos$ = this.ngFirestore.doc<TodoModel>(`todos/${user.uid}`).valueChanges();
      this.todos$.subscribe(todos => {
        this.todos = todos.todos;
        this.display = todos.todos;
      });
    });
  }

  handleFilter(filter: string) {
    switch (filter) {
      case 'All': {
        this.display = this.todos;
        break;
      }
      case 'In Progress': {
        this.display = this.todos.filter(todo => {
          return !todo.completed;
        });
        break;
      }
      case 'Completed': {
        this.display = this.todos.filter(todo => {
          return todo.completed;
        });
        break;
      }
    }
  }

  // Create
  async addTodo(e) {
    if (e.key === 'Enter') {
      let title: string = e.target.value;
      if (!title) {
        return;
      } else {
        this.authService.user$.subscribe(user => {
          const data: Todo = {
            uid: user.uid,
            title,
            completed: false
          };
          const todoCol: AngularFirestoreCollection = this.ngFirestore.collection(
            'todos/' + user.uid
          );
          todoCol.add(data);
        });
      }
      e.target.blur();
      e.target.value = '';
    }
  }

  // Update
  async updateTodo(e, todo: Todo) {}

  // Delete
  async deleteTodo(todo: Todo) {}
}

interface TodoModel {
  todos: Todo[];
}
