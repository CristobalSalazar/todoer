import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { User } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public user$: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // create but not subscribe
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // another observable
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.router.navigate(["/todos"]);
    return this.updateUserData(credential.user);
  }

  public async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(["/"]);
  }

  private updateUserData(user) {
    const { uid, email, photoURL } = user;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    const data = { uid, email, photoURL };
    return userRef.set(data, { merge: true });
  }
}
