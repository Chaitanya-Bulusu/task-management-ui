import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './gaurds/auth.gaurd';
// ...existing code...

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    {
        path: 'tasks',
        canActivate: [AuthGuard],
        children: [
            { path: '', loadComponent: () => import('./components/tasks/task-list.component').then(m => m.TaskListComponent) },
            { path: 'create', loadComponent: () => import('./components/tasks/create-task/create-task.component').then(m => m.CreateTaskComponent) },
            { path: 'edit', loadComponent: () => import('./components/tasks/create-task/create-task.component').then(m => m.CreateTaskComponent) }
        ]
    },
    { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];
