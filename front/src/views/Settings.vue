<script>
import { useUsersStore, useTaskStore } from "@/stores";
import { mapStores } from "pinia";

export default {
  data() {
    return {
      fullname: "",
      email: "",
      selectedServices: [],
    };
  },
  methods: {},

  computed: {
    ...mapStores(useUsersStore, useTaskStore),
    username() {
      return this.usersStore.currentUser.username;
    },
    // email() {
    //   return this.usersStore.currentUser.email
    // },
    // fullname() {
    //   return this.usersStore.currentUser.fullname || 'Не указано'
    // }
    fullnameComputed() {
      return this.fullname || "Не указан";
    },
    emailComputed() {
      return this.email || "Не указан";
    },
    updateUser() {},
  },
  mounted() {
    if (this.usersStore.users.length == 0) {
      this.taskStore.getInfo();
    }
    this.fullname = this.usersStore.currentUser.fullname;
    this.email = this.usersStore.currentUser.email;
    this.selectedServices = [...this.usersStore.selectedServices]
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="title">{{ username }}</p>
    <p class="task__time m2">id: {{ this.usersStore.currentUser.id }}</p>
    <p>email:</p>
    <input class="input m1" v-model="this.email" />
    <p>Имя:</p>
    <input class="input m3" v-model="this.fullname" />

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

    <button
      @click="this.usersStore.updateUser({ fullname, email, selectedServices })"
      class="btn btn-primary btn-md"
    >
      Обновить данные
    </button>
  </div>

  <p></p>
  <div style="width: 400px; margin-top: 300px">
    <button class="btn btn-primary btn-md">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-accent">Accent</button>
    <button class="btn btn-outline">Outline</button>
  </div>

  <!-- <p>{{ this.exampleStore.counter }}</p> -->
  <button>+1</button>

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

<style scoped>
/* input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="checkbox"]:checked {
}

input[type="checkbox"]:disabled {
} */
</style>
