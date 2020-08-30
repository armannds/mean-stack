import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'http://localhost:3000/api/user';
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post(`${this.BASE_URL}/signup`, authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{ token: string; expiresIn: number }>(
        `${this.BASE_URL}/login`,
        authData
      )
      .subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          const expiresInSeconds = response.expiresIn * 1000;
          this.setAuthenticationTimer(expiresInSeconds);
          const expirationDate = new Date().getTime() + expiresInSeconds;
          this.saveAuthenticationData(this.token, new Date(expirationDate));
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthenticateUser() {
    const authenticationData = this.getAutenticationData();
    if (!authenticationData) {
      return;
    }
    const now = new Date();
    const expiresIn =
      authenticationData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authenticationData.token;
      this.isAuthenticated = true;
      this.setAuthenticationTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['/']);
    this.clearAuthenticationData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthenticationTimer(duration: number) {
    console.log(`Setting timer: ${duration}`);
    this.tokenTimer = setTimeout(() => this.logout(), duration);
  }

  private saveAuthenticationData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private getAutenticationData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }

  private clearAuthenticationData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
