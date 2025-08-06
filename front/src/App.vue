<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async getInfo() {
      const response = await fetch("http://localhost:3000/get-info"); // делаем GET-запрос

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      console.log(data);
    },
    async getInfo2() {
      const response = await fetch("http://localhost:3000/get-info2"); // делаем GET-запрос

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      console.log(data);
    },
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

    async login() {
      // console.log(this.username, this.password)
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
    text-decoration: none;
  }
</style>
