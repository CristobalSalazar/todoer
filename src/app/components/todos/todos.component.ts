import { Component, OnInit } from '@angular/core';
import Todo from '../../interfaces/Todo';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { tap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  public todos$;
  constructor(
    private authService: AuthService,
    private ngFirestore: AngularFirestore,
    private ngAuth: AngularFireAuth
  ) {
    this.todos$ = this.authService.user$.pipe(
      switchMap(user => {
        return this.ngFirestore.collection(`todos/${user.uid}/items`).valueChanges();
      }),
      map(arr => {
        arr.sort((a: any, b: any) => {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        return arr;
      })
    );
  }
  getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  ngOnInit() {}

  handleFilter(filter: string) {
    switch (filter) {
      case 'All': {
        break;
      }
      // in progress
      case 'In Progress': {
        break;
      }
      // completed
      case 'Completed': {
        break;
      }
    }
  }

  // Create
  async addTodo(e) {
    if (e.key === 'Enter') {
      let title: string = e.target.value;
      if (!title || title === '') {
        return;
      } else {
        const uid = this.ngAuth.auth.currentUser.uid;
        const todoRef = this.ngFirestore.collection(`todos/${uid}/items`).ref.doc();
        const data = {
          id: todoRef.id,
          title,
          completed: false,
          createdAt: this.getTimestamp()
        };
        todoRef.set(data);
      }
      e.target.blur();
      e.target.value = '';
    }
  }

  // Update
  async updateTodo(e, todo: Todo) {
    const uid = this.ngAuth.auth.currentUser.uid;
    const title = e.target.value;
    if (!title || title === '' || title === todo.title) {
      e.target.value = todo.title;
      return;
    }
    const data = {
      title,
      updatedAt: this.getTimestamp()
    };
    this.ngFirestore
      .collection(`todos/${uid}/items`)
      .doc(todo.id)
      .set(data, { merge: true });
  }
  // Delete
  async deleteTodo(todo: Todo) {
    const uid = this.ngAuth.auth.currentUser.uid;
    this.ngFirestore
      .collection(`todos/${uid}/items`)
      .doc(todo.id)
      .delete();
  }
}
