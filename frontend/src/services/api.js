import axios from "axios";

const API_URL = "http://localhost:5001";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  async (config) => {
    // Check if we have a token in localStorage
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      const { token } = JSON.parse(authUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Save user to backend
export const saveUserToBackend = async (
  uid,
  email,
  token,
  displayName = null
) => {
  try {
    const response = await api.post(
      "/api/save-user",
      {
        uid,
        email,
        displayName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving user to backend:", error);
    throw error;
  }
};

// Save a creation to the database
export const saveCreation = async (textprompt, image) => {
  try {
    const response = await api.post(`/creations`, {
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
    const response = await api.get(`/creations`, {
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
    const response = await api.get(`/creations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching creation with ID ${id}:`, error);
    throw error;
  }
};
