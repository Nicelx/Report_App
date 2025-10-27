<script>
import { useUsersStore } from "@/stores/usersStore";
import { mapStores } from "pinia";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  computed: {
    ...mapStores(useUsersStore),
  },
  methods: {
    async login() {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        this.usersStore.login(
          {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
          data.user
        );

        this.$router.push("/");
      } else {
        this.message = "Login failed";
      }
    },
  },
  mounted() {
    if (this.usersStore.isAuthenticated) {
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m2">Login</h1>
    <p>{{ message }}</p>
    <p class="m1">Login</p>
    <input
      class="input m1"
      v-model="username"
      type="text"
      placeholder="login"
    />
    <p class="m1">Password</p>
    <input
      class="input m1"
      v-model="password"
      type="password"
      placeholder="password"
    />
    <div class="row">
      <button @click="login" class="btn btn-primary">Log In</button>
      <button class="btn btn-outline">
        <router-link to="/register">Register</router-link>
      </button>
    </div>
  </div>
</template>
