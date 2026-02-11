const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return { isValid: false, error: "No token found" };
  }

  if (isTokenExpired(token)) {
    return { isValid: false, error: "Token expired" };
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      return { isValid: false, error: "Token expired or invalid" };
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { isValid: false, error: data.message || "Token verification failed" };
    }

    const data = await response.json();
    return { isValid: data.valid === true, error: null };
  } catch (error) {
    if (error.message && error.message.includes("Failed to fetch")) {
      return { isValid: false, error: "Network error. Please check your connection." };
    }
    return { isValid: false, error: error.message || "Token verification failed" };
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
};

