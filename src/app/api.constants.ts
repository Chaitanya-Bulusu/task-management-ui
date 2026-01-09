import { get } from "http";

export const API_CONSTANTS = {
    BASE_URL: 'http://localhost:5115/api',

    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh-token',
        LOGOUT: '/auth/logout'
    },

    TASKS: {
        GET_TASKS: '/task/get-tasks',
        CREATE_TASK: '/task/create-task',
        UPDATE_TASK: '/task/update-task',
        DELETE_TASK: '/task/delete-task'

    }

}