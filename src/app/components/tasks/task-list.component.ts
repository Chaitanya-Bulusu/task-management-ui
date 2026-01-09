import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { TaskService } from './task.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    standalone: true,
    selector: 'app-task-list',
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatCardModule,
        RouterLink,
        AgGridModule,

    ],
    templateUrl: './task-list.component.html',

    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

    columnDefs = [
        { headerName: 'ID', field: 'id', hide: true }, // hidden task id column
        { headerName: 'Title', field: 'title', sortable: true, filter: true },
        { headerName: 'Priority', field: 'priority', sortable: true, filter: true },
        { headerName: 'Status', field: 'status', sortable: true, filter: true },
        { headerName: 'Due Date', field: 'dueDate', valueFormatter: (params: { value: string | number | Date; }) => params.value ? new Date(params.value).toLocaleDateString() : '', sortable: true, filter: true },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => {
                return `
        <button class="action-btn edit-btn" data-action="edit">Edit</button>
        <button class="action-btn delete-btn" data-action="delete">Delete</button>
      `;
            },
            width: 140,
            suppressMenu: true,
            suppressSorting: true,
            cellStyle: { display: 'flex', gap: '0.5rem', 'justify-content': 'center' }
        }
    ];
    tasks: any[] = [];
    hasFilters: any;
    private gridApi: any;

    constructor(private taskService: TaskService, private router: Router) { }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        // Fetch all tasks for non-paginated grid
        this.taskService
            .getTasks()
            .subscribe(res => {
                this.tasks = res.items || res;
            });
    }



    onGridReady(params: any) {
        this.gridApi = params.api;
        params.api.addEventListener('cellClicked', (event: any) => {
            if (event.colDef.headerName === 'Actions') {
                if (event.event.target.dataset.action === 'edit') {
                    this.editTask(event.data);
                } else if (event.event.target.dataset.action === 'delete') {
                    this.deleteTask(event.data);
                }
            }
        });
    }

    editTask(task: any) {

        this.router.navigate(['/tasks/edit'], { state: { task } });
    }

    deleteTask(task: any) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskService.deleteTask(task.id).subscribe({
                next: () => {
                    alert('Task deleted successfully.');
                    this.tasks = this.tasks.filter(t => t.id !== task.id);
                },
                error: err => alert('Failed to delete task: ' + err?.error?.message || err),

            });
        }
    }

    onFilterChanged(): void {
        if (this.gridApi) {
            const filterModel = this.gridApi.getFilterModel();
            this.hasFilters = filterModel && Object.keys(filterModel).length > 0;
        } else {
            this.hasFilters = false;
        }
    }

    clearFilters() {
        this.hasFilters = false;
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
        }
    }

}