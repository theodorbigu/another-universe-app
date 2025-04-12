import axios from "axios";

const API_URL = "http://localhost:5001";

// Save a creation to the database
export const saveCreation = async (textprompt, image) => {
  try {
    const response = await axios.post(`${API_URL}/creations`, {
      textprompt,
      image,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving creation:", error);
    throw error;
  }
};

// Get all creations with optional pagination
export const getCreations = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/creations`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching creations:", error);
    throw error;
  }
};

// Get a specific creation by ID
export const getCreationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/creations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching creation with ID ${id}:`, error);
    throw error;
  }
};
