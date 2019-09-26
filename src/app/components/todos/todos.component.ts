import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import ITodo from '../../interfaces/ITodo';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  public todos$: Observable<ITodo[]>;
  public todos: ITodo[];
  private todosSubscription: Subscription;
  private filterMode: string = 'All';
  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.todos$ = this.authService.user$.pipe(
      switchMap(user => {
        return this.afs.collection<ITodo>(`todos/${user.uid}/items`).valueChanges();
      }),
      map(arr => {
        arr.sort((a: ITodo, b: ITodo): number => {
          if (a.createdAt == null) return -1;
          if (b.createdAt == null) return 1;
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        return arr;
      })
    );
  }
  ngOnInit() {
    this.todosSubscription = this.todos$.subscribe(todos => {
      this.todos = todos;
    });
  }
  ngOnDestroy() {
    this.todosSubscription.unsubscribe();
  }

  getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  handleFilter(filter: string) {}
  // Create
  async addTodo(e) {
    if (e.key === 'Enter') {
      let title: string = e.target.value;
      if (!title) {
        return;
      } else {
        const uid: string = this.afAuth.auth.currentUser.uid;
        const ref = this.afs.collection(`todos/${uid}/items`).ref.doc();
        const data: ITodo = {
          id: ref.id,
          title,
          completed: false,
          createdAt: this.getTimestamp()
        };
        await ref.set(data);
      }
      e.target.blur();
      e.target.value = '';
    }
  }
  updateTodoTitle(e, todo: ITodo) {
    const uid = this.afAuth.auth.currentUser.uid;
    const title = e.target.value;
    if (!title || title === '' || title === todo.title) {
      e.target.value = todo.title;
      return;
    }
    const data = {
      title,
      updatedAt: this.getTimestamp()
    };
    this.afs
      .collection(`todos/${uid}/items`)
      .doc(todo.id)
      .set(data, { merge: true });
  }
  updateTodoCompleted(e, todo: ITodo) {
    const uid = this.afAuth.auth.currentUser.uid;
    const data = {
      completed: !todo.completed,
      updatedAt: this.getTimestamp()
    };
    this.afs
      .collection(`todos/${uid}/items`)
      .doc(todo.id)
      .set(data, { merge: true });
  }
  deleteTodo(todo: ITodo) {
    const uid = this.afAuth.auth.currentUser.uid;
    this.afs
      .collection(`todos/${uid}/items`)
      .doc(todo.id)
      .delete();
  }
}
