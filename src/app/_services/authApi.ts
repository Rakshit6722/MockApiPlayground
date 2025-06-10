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
        if (err?.response?.status === 404) {
            throw new Error("User not found");
        } else if (err?.response?.status === 401) {
            throw new Error("Invalid password");
        } else {
            throw new Error(err?.message ?? "Internal server error");
        }
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
        if (err?.response?.status === 409) {
            throw new Error("User already exists");
        }
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

export async function forgotPassword(email: string) {
    try {
        const response = await apiConnector(
            'POST',
            `${BASE_URL}/forgot-password`,
            { email },
            null,
            false
        )

        return response
    } catch (err: any) {
        if (err?.response?.status === 404) {
            throw new Error("User not found");
        } else if (err?.response?.status === 400) {
            throw new Error("Invalid email format");
        }
        throw new Error(err?.message ?? "Internal server error");
    }
}

export async function verifyResetToken(token: string, email: string) {
    try {
        const response = await apiConnector(
            'POST',
            `${BASE_URL}/verify-reset-token`,
            { token, email },
            null,
            false
        )
        return response
    } catch (err: any) {
        throw new Error(err?.message ?? "Internal server error");
    }
}

export async function resetPassword(token: string, email: string, newPassword: string) {
    try {
        const response = await apiConnector(
            'POST',
            `${BASE_URL}/reset-password`,
            { token, email, password: newPassword },
            null,
            false
        )
        return response
    } catch (err: any) {
        throw new Error(err?.message ?? "Internal server error");
    }
}