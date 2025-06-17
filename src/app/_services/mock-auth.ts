import { apiConnector } from "./interceptor/apiConnector";

const CREATE_BASE_URL = '/api/create-mock-auth';
const MOCK_BASE_URL = '/api/mock-auth';

export async function createMockAuthRoute(data: any): Promise<any> {
    try {
        const response = await apiConnector(
            "POST",
            CREATE_BASE_URL,
            data,
            null,
            true
        )
        if (response?.status !== 201) {
            throw new Error('Failed to create mock auth route');
        }
        return response;
    } catch (error: any) {
        console.error('Error creating mock auth route:', error);
        if(error?.response?.status === 409) {
            throw new Error('Mock Auth already exists for this endpoint, try making with some other endpoint name');
        }else{
            throw new Error(error.message || 'Failed to create mock auth route');
        }
    }
}

export async function updateMockAuthRoute(mockId: string, data: any): Promise<any> {
    try{
        const response = await apiConnector(
            "PUT",
            `${CREATE_BASE_URL}/${mockId}`,
            data,
            null,
            true
        )
        if (response?.status !== 200) {
            throw new Error('Failed to update mock auth route');
        }
        return response
    }catch(err: any){
        console.error('Error updating mock auth route:', err);
        throw new Error(err.message || 'Failed to update mock auth route');
    }
}

export async function deleteMockAuthRoute(mockId: string): Promise<any> {
    try{
        const response = await apiConnector(
            "DELETE",
            `${CREATE_BASE_URL}/${mockId}`,
            null,
            null,
            true
        )
        if (response?.status !== 200) {
            throw new Error('Failed to delete mock auth route');
        }
        return response;
    }catch(err: any){
        console.error('Error deleting mock auth route:', err);
        throw new Error(err.message || 'Failed to delete mock auth route');
    }
}

export async function deleteAllMockAuthRoutes(): Promise<any> {
    try{
        const response = await apiConnector(
            "DELETE",
            CREATE_BASE_URL,
            null,
            null,
            true
        )
        if (response?.status !== 200) {
            throw new Error('Failed to delete all mock auth routes');
        }
        return response;
    }catch(err: any){
        console.error('Error deleting all mock auth routes:', err);
        throw new Error(err.message || 'Failed to delete all mock auth routes');
    }
}

export async function getMockAuthRoutes(): Promise<any> {
    try {
        const response = await apiConnector(
            'GET',
            CREATE_BASE_URL,
            null,
            null,
            true
        );
        if (response?.status !== 200) {
            throw new Error('Failed to fetch mock auth routes');
        }
        return response;
    } catch (error: any) {
        console.error('Error fetching mock auth routes:', error);
        throw new Error(error.message || 'Failed to fetch mock auth routes');
    }
}

export async function getMockAuthRoute(mockId: string): Promise<any> {
    try {
        const response = await apiConnector(
            'GET',
            `${CREATE_BASE_URL}/${mockId}`,
            null,
            null,
            true
        );
        if (response?.status !== 200) {
            throw new Error('Failed to retrieve mock auth route');
        }
        return response;
    } catch (error: any) {
        console.error('Error retrieving mock auth route:', error);
        throw new Error(error.message || 'Failed to retrieve mock auth route');
    }
}


export async function mockSignIn(endpoint: string, fields: any, username: string): Promise<any> {
    try {
        const response = await apiConnector(
            "POST",
            `${MOCK_BASE_URL}/${endpoint}/signup/${username}`,
            fields,
            null,
            false
        )

        if (response?.status !== 200) {
            throw new Error('Failed to sign in with mock auth');
        }
        return response
    } catch (err: any) {
        console.error('Error in mockSignIn:', err);
        throw new Error(err.message || 'Failed to sign in with mock auth');
    }
}

export async function mockLogin(endpoint: string, fields: any, username: string): Promise<any> {
    try {
        const response = await apiConnector(
            "POST",
            `${MOCK_BASE_URL}/${endpoint}/login/${username}`,
            fields,
            null,
            false
        )

        if (response?.status !== 200) {
            throw new Error('Failed to login with mock auth');
        }
        return response
    } catch (err: any) {
        console.error('Error in mockLogin:', err);
        throw new Error(err.message || 'Failed to login with mock auth');
    }
}

export async function mockLogout(endpoint: string, username: string): Promise<any> {
    try {
        const response = await apiConnector(
            "GET",
            `${MOCK_BASE_URL}/${endpoint}/logout/${username}`,
            null,
            null,
            false
        )

        if (response?.status !== 200) {
            throw new Error('Failed to logout with mock auth');
        }
        return response
    } catch (err: any) {
        console.error('Error in mockLogout:', err);
        throw new Error(err.message || 'Failed to logout with mock auth');
    }
}

export async function getMockUserData(userId: string) {
    try {
        const response = await apiConnector(
            "GET",
            `${MOCK_BASE_URL}/${userId}`,
            null,
            null,
            true
        );

        if (response?.status !== 200) {
            throw new Error('Failed to retrieve mock user data');
        }
        return response;
    } catch (err: any) {
        console.error('Error in getMockUserData:', err);
        throw new Error(err.message || 'Failed to retrieve mock user data');
    }
}