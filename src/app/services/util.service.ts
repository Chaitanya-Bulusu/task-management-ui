import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    constructor() { }

    get priorityOptions() {
        return [
            { value: 1, label: 'Low' },
            { value: 2, label: 'Medium' },
            { value: 3, label: 'High' }
        ];
    }

    get taskStatusOptions() {
        return [
            { value: 1, label: 'Pending' },
            { value: 2, label: 'Completed' }
        ];
    }
}