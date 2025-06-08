import { apiConnector } from "./interceptor/apiConnector";

const BASE_URL = '/api/auth';

export async function login(data: any) {
    try {
        const response = await apiConnector(
            'POST',
            `${BASE_URL}/login`,
            data,
            null,
            false
        )
        if (response?.status === 200) {
            return response?.data;
        } else {
            throw new Error(response?.data?.message || "Login failed");
        }
    } catch (err: any) {
        console.error("Error in authApi:", err);
        throw new Error(err?.message ?? "Internal server error");
    }
}

export async function registerUser(data: any) {
    try {
        const response = await apiConnector(
            'POST',
            `${BASE_URL}/signup`,
            data,
            null,
            false
        )
        return response
    } catch (err: any) {
        console.error("Error in authApi:", err);
        throw new Error(err?.message ?? "Internal server error");
    }
}


export async function logout() {
    try {
        const response = await apiConnector(
            'GET',
            `${BASE_URL}/logout`,
            null,
            null,
            true
        )
        return response?.data
    } catch (err: any) {
        console.error("Error in authApi:", err);
        throw new Error(err?.message ?? "Internal server error");
    }
}