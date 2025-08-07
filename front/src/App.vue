<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async createUser() {
      const response = await fetch("http://localhost:3000/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
    },
  },
};
</script>

<template>
  <nav class = "nav m2">
    <router-link to="/">Home</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/settings">Settings</router-link>
    <a href="">Log out</a>
  </nav>

  <router-view />
</template>

<style scoped>
  .nav {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 15px;
    background-color: var(--color-primary);
    padding-inline: 20px;
  }
  .nav a {
    color: var(--color-light);
    font-weight: 700;
    text-decoration: none;
  }
</style>
