export async function updateMock(mockId: string, mockData: any): Promise<any> {
  try {
    const response = await fetch(`/api/mock/${mockId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(mockData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update mock: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating mock:', error);
    throw error;
  }
}

export async function deleteMock(mockId: string): Promise<any> {
  try {
    const response = await fetch(`/api/mock/${mockId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete mock: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting mock:', error);
    throw error;
  }
}


export async function createMockRoute(data: any) {
  try {
    const response = await fetch('/api/mock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create endpoint');
    }

    return await response.json();
  } catch (err: any) {
    console.error('Error creating mock route:', err);
    throw new Error(err.message || 'Failed to create mock route');
  }
}


export async function getMockRoute(mockId: string) {
  try {
    const response = await fetch(`/api/mock/${mockId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error retrieving mock route:', err);
    throw new Error(err.message || 'Failed to retrieve mock route');
  }
}