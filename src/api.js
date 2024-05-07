import axios from 'axios';

// Set up a base URL for API requests
const API_BASE_URL = 'https://millville-calendar-a4e239009a4b.herokuapp.com'; // Adjust this to the actual URL of your server

// Create an instance of axios with the base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 500000, // Extend the timeout to handle long-running requests
});

// Function to process events
export const processEvents = async (formData) => {
    try {
        const response = await api.post('/processEvents', formData);
        return response.data; // Returns the data from the server response including requestId
    } catch (error) {
        console.error('Error during API call:', error);
        throw error; // Rethrow or handle as needed
    }
};

// Function to check the status of the processing using a requestId
export const checkStatus = async (requestId) => {
    try {
        const response = await api.get(`/status/${requestId}`);
        return response.data; // Expected to return the status of the process
    } catch (error) {
        console.error('Error checking status:', error);
        throw error; // Rethrow or handle as needed
    }
};
