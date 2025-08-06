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
        body: JSON.stringify({ username: this.username, password: this.password }),
      });
    },
  },
};

</script>

<template>
   <div class = "wrapper">
    <h1 class = "title m2">Registration</h1>
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
      <button class = "btn btn-primary">Register</button>
    </div>
  </div>
</template>