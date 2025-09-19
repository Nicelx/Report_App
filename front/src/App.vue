<script>
</script>

<template>
  <nav class = "nav m2">
    <router-link to="/">Home</router-link>
    <router-link to="/report">Report</router-link>
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
