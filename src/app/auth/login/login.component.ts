import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']

})

export class LoginComponent {
  isLoading = false;

  constructor() { }

  onLogin(form: NgForm) {
    //
  }
}
