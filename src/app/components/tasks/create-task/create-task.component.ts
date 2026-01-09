import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { TaskRequest } from '../../../models/models';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UtilService } from '../../../services/util.service';

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class CreateTaskComponent {
    task: TaskRequest = {
        id: 0,
        title: '',
        description: '',
        dueDate: null,
        priority: 1,
        status: 1
    };
    isEditMode = false;

    utilService = inject(UtilService);

    constructor(private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute) {
        const nav = this.router.getCurrentNavigation();
        const stateTask = nav?.extras.state?.['task'];
        if (stateTask) {
            this.task = {
                id: stateTask.id || 0,
                title: stateTask.title || '',
                description: stateTask.description || '',
                dueDate: stateTask.dueDate ? new Date(stateTask.dueDate) : null,
                priority: this.utilService.priorityOptions.find(option => option.label === stateTask.priority)?.value || 1,
                status: this.utilService.taskStatusOptions.find(option => option.label === stateTask.status)?.value || 1
            };
            this.isEditMode = true;
        }
    }

    onSubmit() {
        if (this.isEditMode) {
            this.taskService.updateTask(this.task).subscribe({
                next: () => this.router.navigate(['/tasks']),
                error: err => alert('Failed to update task: ' + err?.error?.message || err)
            });
        } else {
            this.taskService.createTask(this.task).subscribe({
                next: () => this.router.navigate(['/tasks']),
                error: err => alert('Failed to create task: ' + err?.error?.message || err)
            });
        }
    }

    onCancel() {
        if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
            this.router.navigate(['/tasks']);
        }
    }
}
