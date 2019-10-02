import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public auth: AuthService;
  constructor(auth: AuthService) {
    this.auth = auth;
  }
  ngOnInit() {}
}
