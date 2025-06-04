import axios, { Method } from "axios";


const apiInstance: any = axios.create({})

apiInstance.interceptors.request.use(
    (config: any) => {
        if (config.requireAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                throw new Error('No authentication token found');
            }
        }

        delete config.requireAuth;
        return config
    },
    (error: any) => {
        return Promise.reject(error);
    }
)

export function apiConnector(method: Method, url: string, body: any, header: any, requireAuth: boolean) {
    return apiInstance({
        method: method,
        url: url,
        data: body ? body : {},
        headers: {
            'Content-Type': header?.formType ? 'multipart/form-data' : 'application/json',
            ...header,
        },
        requireAuth: requireAuth,
    })
}