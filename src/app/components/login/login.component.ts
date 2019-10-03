import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  constructor(private auth: AuthService) {}

  googleLogin() {
    this.auth.googleSignIn();
  }

  facebookLogin() {
    this.auth.facebookSignIn();
  }

  githubLogin() {
    this.auth.githubSignIn();
  }

  emailLogin(event) {
    event.preventDefault();
    const pass: string = document.getElementById('password').value;
    const email: string = document.getElementById('email').value;
    this.auth.emailSignIn(email, pass);
  }

  ngOnInit() {}
}
