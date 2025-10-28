<script>
import { useUsersStore } from "@/stores/usersStore";
import { mapStores } from "pinia";
import Messages from "./components/Messages.vue";

export default {
  methods: {
    logout() {
      this.usersStore.logout();
      this.$router.push("/login");
    },
  },
  components: {
    Messages,
  },
  computed: {
    ...mapStores(useUsersStore),
  },
};
</script>

<template>
  <Messages/>
  <nav class="nav m2">
    <router-link to="/">Tasks</router-link>
    <router-link to="/report">Send Report</router-link>
    <router-link to="/projects">Projects</router-link>
    <router-link v-if="!usersStore.isAuthenticated" to="/login">Login</router-link>
    <router-link v-if="usersStore.currentUser.role == 'admin'" to="/register">Register</router-link>
    <router-link to="/settings">Settings</router-link>
    <a href="#" @click.prevent="logout">Log out</a>
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
