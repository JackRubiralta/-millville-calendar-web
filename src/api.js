import axios from 'axios';

// Set up a base URL for API requests
const API_BASE_URL = 'http://localhost:3000'; // Adjust this to the actual URL of your server

// Create an instance of axios with the base URL
const api = axios.create({
    baseURL: API_BASE_URL
});

// Function to process events
export const processEvents = async (formData) => {
    try {
        const response = await api.post('/processEvents', formData);
        return response.data; // Returns the data from the server response
    } catch (error) {
        // Handle errors (e.g., network error, server response error)
        console.error('Error during API call:', error);
        throw error; // Rethrow or handle as needed
    }
};

// You can add more API functions here if needed

