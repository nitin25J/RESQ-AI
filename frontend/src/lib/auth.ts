export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("resq_admin_token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("resq_admin_token");
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("resq_admin_token");
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  // Could add basic JWT expiry check here if needed, 
  // but for now existence is sufficient since backend validates it.
  return true;
};
