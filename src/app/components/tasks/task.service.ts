import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONSTANTS } from "../../api.constants";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(private http: HttpClient) { }

    getTasks() {
        return this.http.get<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.TASKS.GET_TASKS}`);
    }

    createTask(task: any) {
        return this.http.post<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.TASKS.CREATE_TASK}`, task);
    }

    updateTask(task: any) {
        return this.http.put<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.TASKS.UPDATE_TASK}/${task.id}`, task);
    }

    deleteTask(taskId: number) {
        return this.http.delete<any>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.TASKS.DELETE_TASK}/${taskId}`);
    }
}