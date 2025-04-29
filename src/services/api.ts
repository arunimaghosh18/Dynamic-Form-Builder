
import { User, FormResponse } from '@/types/form';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (user: User): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rollNumber: user.rollNumber,
        name: user.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // We convert the error to a structured format with message
      throw {
        status: response.status,
        message: error.message || 'Failed to create user',
        code: error.code || 'UNKNOWN_ERROR'
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting form:', error);
    throw error;
  }
};
