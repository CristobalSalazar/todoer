import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { switchMap, map, tap } from "rxjs/operators";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import * as firebase from "firebase/app";
import ITodo from "../interfaces/ITodo";

@Injectable({
  providedIn: "root"
})
export class TodosService {
  public todos$: Observable<ITodo[]>;
  private collection: AngularFirestoreCollection<ITodo>;

  constructor(auth: AuthService, afs: AngularFirestore) {
    this.todos$ = auth.user$.pipe(
      switchMap(user => {
        this.collection = afs.collection<ITodo>(`todos/${user.uid}/items`);
        return this.collection.valueChanges();
      }),
      map(arr => {
        return arr.sort((a, b) => {
          if (!a.createdAt) return -1;
          if (!b.createdAt) return 1;
          const secondsDiff = b.createdAt.seconds - a.createdAt.seconds;
          if (secondsDiff === 0) {
            return b.createdAt.nanoseconds - a.createdAt.nanoseconds;
          } else return secondsDiff;
        });
      })
    );
  }

  async create(todo: ITodo) {
    const ref = this.collection.ref.doc();
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const data: ITodo = {
      id: ref.id,
      title: todo.title,
      completed: false,
      createdAt: ts
    };
    await ref.set(data);
  }

  async update(todo: ITodo) {
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    todo.updatedAt = ts;
    await this.collection.doc(todo.id).set(todo, { merge: true });
  }

  async delete(todo: ITodo) {
    await this.collection.doc(todo.id).delete();
  }
}
