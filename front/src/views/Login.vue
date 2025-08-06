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
        console.log(data, 'data here')
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        this.$router.push("/");
      } else {
        // console.error("Login failed:", await response.json());
        this.message = 'Login failed';
      }

      console.log(response);
    },
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
    <div class = "btns">
      <button class = "btn btn-primary">Log In</button>
      <button class = "btn btn-outline">Register</button>
    </div>
  </div>
</template>

<style scoped>
  .btns {
    display: flex;
    gap: 10px;
  }
</style>
