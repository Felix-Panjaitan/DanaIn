import { authAPI } from "./api";

/**
 * Check if user is logged in
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  return (
    localStorage.getItem("isUserLoggedIn") === "true" &&
    !!localStorage.getItem("authToken")
  );
}

/**
 * Get current user role
 * @returns {string|null} User role or null if not logged in
 */
export function getUserRole() {
  return isAuthenticated() ? localStorage.getItem("userRole") : null;
}

/**
 * Get current username
 * @returns {string|null} Username or null if not logged in
 */
export function getUsername() {
  return isAuthenticated() ? localStorage.getItem("loggedInUserName") : null;
}

/**
 * Login user
 * @param {Object} credentials - Login credentials (username/email and password)
 * @returns {Promise<Object>} User data
 */
export async function login(credentials) {
  try {
    const response = await authAPI.login(credentials);

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("isUserLoggedIn", "true");
    localStorage.setItem("loggedInUserName", response.user.name);
    localStorage.setItem("userRole", response.user.role);

    return response.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data
 */
export async function register(userData) {
  try {
    const response = await authAPI.register(userData);

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("isUserLoggedIn", "true");
    localStorage.setItem("loggedInUserName", response.user.name);
    localStorage.setItem("userRole", response.user.role);

    return response.user;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isUserLoggedIn");
  localStorage.removeItem("loggedInUserName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("notificationPreferences");

  // Redirect to home page
  window.location.href = "/index.html";
}

/**
 * Redirect if not authenticated
 * @param {string} redirectUrl - URL to redirect to if not authenticated
 */
export function requireAuth(redirectUrl = "/auth.html#login") {
  if (!isAuthenticated()) {
    const currentPath = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.href = `${redirectUrl}?redirect=${currentPath}`;
    return false;
  }
  return true;
}

/**
 * Redirect if not authorized for role
 * @param {string|string[]} allowedRoles - Allowed roles
 * @param {string} redirectUrl - URL to redirect to if not authorized
 */
export function requireRole(allowedRoles, redirectUrl = "/index.html") {
  const currentRole = getUserRole();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!currentRole || !roles.includes(currentRole)) {
    alert(`Only ${roles.join(" or ")} can access this page.`);
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

export default {
  isAuthenticated,
  getUserRole,
  getUsername,
  login,
  register,
  logout,
  requireAuth,
  requireRole,
};
