import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-management-ui';

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
