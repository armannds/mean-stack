import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(
        (isAuthenticated) => (this.userIsAuthenticated = isAuthenticated)
      );
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
