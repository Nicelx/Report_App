import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: !!localStorage.getItem("authToken"),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  actions: {
    login(tokens, userData) {
      localStorage.setItem("authToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      this.isAuthenticated = true;
      this.user = userData;
    },
    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      this.isAuthenticated = false;
      this.user = null;
    },
    updateAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem("authToken");
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    },
  },
});
