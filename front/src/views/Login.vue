<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      message: ''
    };
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

        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken)
        localStorage.setItem("user", JSON.stringify(data.user));

        this.$router.push("/");
      } else {
        this.message = 'Login failed';
      }
    },


    // temp
    // async refresh() {
    //   const refreshToken = localStorage.getItem("refreshToken");
    //   const response = await fetch("http://localhost:3000/refresh-token", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${refreshToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       username: this.username,
    //       password: this.password,
    //     }),
    //   });
    // }
  },
};
</script>

<template>
  <div class = "wrapper">
    <h1 class = "title m2">Login</h1>
    <p>{{ message }}</p>
      <p class = "m1">Login</p>
      <input
        class = "input m1"
        v-model="username"
        type="text"
        placeholder="login"
      />
    <p class = "m1">Password</p>
    <input
      class = "input m1"
      v-model="password"
      type="password"
      placeholder="password"
    />
    <div class = "row">
      <button @click="login" class = "btn btn-primary">Log In</button>
      <button class = "btn btn-outline"><router-link to="/register">Register</router-link></button>
      <!-- <button @click="refresh">refresh token</button> -->
    </div>
  </div>
</template>
