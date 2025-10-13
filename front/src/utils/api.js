export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("authToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(url, config);
  console.log('fetch with Auth')

  if (response.status === 401 && token) {
    try {
      const {newAccessToken, newRefreshToken} = await refreshAuthToken();

      localStorage.setItem("authToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      config.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, config);
    } catch (error) {
      throw error;
    }
  }

  return response;
}

export async function refreshAuthToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("http://localhost:3000/refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    
    return {
      newAccessToken: data.accessToken,
      newRefreshToken: data.refreshToken
    }
  } catch (error) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw error;
  }
}
