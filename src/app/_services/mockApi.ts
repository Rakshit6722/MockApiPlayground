import { apiConnector } from "./interceptor/apiConnector";

const BASE_URL = '/api/mock';

export async function updateMock(mockId: string, mockData: any): Promise<any> {
  try {
    const response = await apiConnector(
      'PATCH',
      `${BASE_URL}/${mockId}`,
      mockData,
      null,
      true
    )
    return response
  } catch (error) {
    console.error('Error updating mock:', error);
    throw error;
  }
}

export async function deleteMock(mockId: string): Promise<any> {
  try {
    const response = await apiConnector(
      'DELETE',
      `${BASE_URL}/${mockId}`,
      null,
      null,
      true
    )

    return response
  } catch (error) {
    console.error('Error deleting mock:', error);
    throw error;
  }
}


export async function createMockRoute(data: any) {
  try {
    const response = await apiConnector(
      'POST',
      BASE_URL,
      data,
      null,
      true
    )
    if (response?.status !== 201) {
      throw new Error('Failed to create mock route');
    }
    return response
  } catch (err: any) {
    if (err?.response?.status === 400) {
      throw new Error('Mock route with this name already exists');
    } else {
      throw new Error(err.message || 'Failed to create mock route');
    }
  }
}


export async function getMockRoute(mockId: string) {
  try {
    const response = await apiConnector(
      'GET',
      `${BASE_URL}/${mockId}`,
      null,
      null,
      true
    )

    if (response?.status !== 200) {
      throw new Error('Failed to retrieve mock route');
    }

    return response?.data[0]
  } catch (err: any) {
    console.error('Error retrieving mock route:', err);
    throw new Error(err.message || 'Failed to retrieve mock route');
  }
}

export async function getAllMockRoutes() {
  try {
    const response = await apiConnector(
      'GET',
      BASE_URL,
      null,
      null,
      true
    )

    if (response?.status !== 200) {
      throw new Error('Failed to retrieve mock routes');
    }

    return response?.data
  } catch (err: any) {
    console.error('Error retrieving mock routes:', err);
    throw new Error(err.message || 'Failed to retrieve mock routes');
  }
}

export async function deleteAllMocks() {
  try {
    const response = await apiConnector(
      'DELETE',
      BASE_URL,
      null,
      null,
      true
    )
    return response?.data
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete all mocks');
  }
}