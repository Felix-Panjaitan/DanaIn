const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.danain.com"
    : "http://localhost:3000";

/**
 * Base fetch function with error handling
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("authToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isUserLoggedIn");
      localStorage.removeItem("loggedInUserName");
      localStorage.removeItem("userRole");
      window.location.href = "/auth.html#login";
      throw new Error("Authentication failed. Please login again.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Auth endpoints
export const authAPI = {
  login: async (credentials) => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  me: async () => {
    return fetchWithAuth("/auth/me");
  },
};

// Projects endpoints
export const projectsAPI = {
  getAll: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return fetchWithAuth(`/projects?${queryString}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/projects/${id}`);
  },

  create: async (projectData) => {
    return fetchWithAuth("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  update: async (id, projectData) => {
    return fetchWithAuth(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

// Investments endpoints
export const investmentsAPI = {
  getMyInvestments: async () => {
    return fetchWithAuth("/investments/my");
  },

  invest: async (investmentData) => {
    return fetchWithAuth("/investments", {
      method: "POST",
      body: JSON.stringify(investmentData),
    });
  },
};

// Wishlists endpoints
export const wishlistsAPI = {
  getMyWishlist: async () => {
    return fetchWithAuth("/wishlists");
  },

  addToWishlist: async (projectId) => {
    return fetchWithAuth("/wishlists", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
  },

  removeFromWishlist: async (projectId) => {
    return fetchWithAuth(`/wishlists/${projectId}`, {
      method: "DELETE",
    });
  },
};

// Notifications endpoints
export const notificationsAPI = {
  getAll: async () => {
    return fetchWithAuth("/notifications");
  },

  markAsRead: async (id) => {
    return fetchWithAuth(`/notifications/${id}/read`, {
      method: "PUT",
    });
  },

  markAllAsRead: async () => {
    return fetchWithAuth("/notifications/read-all", {
      method: "PUT",
    });
  },
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  investments: investmentsAPI,
  wishlists: wishlistsAPI,
  notifications: notificationsAPI,
};
