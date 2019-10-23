import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService
  ) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  onLogin(loginForm: NgForm) {
    this.auth.login(loginForm.value.username, loginForm.value.password);
  }

}
