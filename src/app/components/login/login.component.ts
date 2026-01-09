import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/models';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginData: LoginRequest = { email: '', password: '' };
    errorMessage: string = '';

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.auth.login(this.loginData)
            .subscribe({
                next: (res) => {
                    this.router.navigate(['/tasks']);
                },
                error: (err) => {
                    console.error('Login failed', err);
                }
            })
    }
}