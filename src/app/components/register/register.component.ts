import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/models';
import { MatFormField, MatLabel, MatHint, MatError } from "@angular/material/form-field";
import { MatCardActions, MatCard, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormField, MatLabel, MatInput, MatHint, MatError, MatCardActions, MatCard, MatCardTitle, MatCardContent, MatButtonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            ]]
        });
    }

    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }

    onSubmit(): void {
        this.errorMessage = '';
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        const registerData: RegisterRequest = {
            email: this.email?.value,
            password: this.password?.value
        };
        this.authService.register(registerData).subscribe({
            next: () => {
                alert('Registration successful! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.errorMessage = 'Registration failed. Email might be already taken.';
                console.error(err);
            }
        });
    }
}
