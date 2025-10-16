<script>
import { useUsersStore, useTaskStore } from "@/stores";
import { mapStores } from "pinia";

export default {
  data() {
    return {
      fullname: "",
      email: "",
    };
  },
  methods: {},

  computed: {
    ...mapStores(useUsersStore, useTaskStore),
    username() {
      return this.usersStore.currentUser.username;
    },
    fullnameComputed() {
      return this.fullname || "Не указан";
    },
    emailComputed() {
      return this.email || "Не указан";
    },
    selectedServices: {
      get() {
        if (this.usersStore.selectedServices.length === 0) {
          return this.taskStore.services.map((service) => service.id);
        }
        return this.usersStore.selectedServices;
      },
      set(value) {
        this.usersStore.selectedServices = value;
      },
    },
    selectedProjects: {
      get() {
        if (this.usersStore.selectedProjects.length === 0) {
          return this.taskStore.projects.map((project) => project.id);
        }
        return this.usersStore.selectedProjects;
      },
      set(value) {
        this.usersStore.selectedProjects = value;
      },
    },
  },
  mounted() {
    if (this.usersStore.users.length == 0) {
      this.taskStore.getInfo();
    }
    this.fullname = this.usersStore.currentUser.fullname;
    this.email = this.usersStore.currentUser.email;
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="title">{{ username }}</p>
    <p class="task__time m2">id: {{ this.usersStore.currentUser.id }}</p>
    <p>email:</p>
    <input class="input m1" v-model="this.usersStore.currentUser.email" />
    <p>Имя:</p>
    <input class="input m3" v-model="this.usersStore.currentUser.fullname" />

    <p class="m1">Выберите услуги, которые вы предоставляете:</p>

    <div class="section m3">
      <div
        v-for="service in this.taskStore.services"
        :key="service.id"
        class="checkbox-item"
      >
        <input
          type="checkbox"
          :id="'service_' + service.id"
          :value="service.id"
          v-model="selectedServices"
          class="checkbox-input"
        />
        <label :for="'service_' + service.id" class="checkbox-label">
          {{ service.name }}
        </label>
      </div>
    </div>

    <p class="m1">Выберите проекты, с которыми вы работаете:</p>
    
    <div class="section m3">
      <div
        v-for="project in this.taskStore.projects"
        :key="project.id"
        class="checkbox-item"
      >
        <input
          type="checkbox"
          :id="'project_' + project.id"
          :value="project.id"
          v-model="selectedProjects"
          class="checkbox-input"
        />
        <label :for="'project_' + project.id" class="checkbox-label">
          {{ project.name }}
        </label>
      </div>
    </div>

    <button
      @click="this.usersStore.updateUser()"
      class="btn btn-primary btn-md"
    >
      Обновить данные
    </button>
  </div>

  <div style="width: 400px; margin-top: 300px">
    <button class="btn btn-primary btn-md">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-accent">Accent</button>
    <button class="btn btn-outline">Outline</button>
  </div>

  <!-- <input
    class="input m1"
    v-model="inputDate"
    type="date"
    value="formattedDate"
  /> -->

  <p>
    {{ formattedDate }}
  </p>
</template>

<!-- <div class="message message--success">Успех!</div>
    <div class="message message--success">Задача успешно создана</div>

    <div class="message message--error">Ошибка</div> -->

<style scoped></style>
