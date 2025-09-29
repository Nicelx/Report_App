<!-- тут общая справка по проекту, плюс редактирование проектов если будет нужно -->
 <!-- подумать как хранить текст в базе данных -->
<script>

import { mapStores } from "pinia";

import { useTaskStore, useControlsStore, useCoordinatorStore } from "@/stores";

export default {
  data() {
    return {
      message: "",
    };
  },
  
  mounted() {
    this.taskStore.getInfo();
  },
  computed: {
    ...mapStores(useTaskStore, useControlsStore, useCoordinatorStore),
  }
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Проекты Malina Clinic</h1>

    <p v-if="message">{{ message }}</p>


    <select class="select m1" v-model="this.controlsStore.selectedProject">
        <option disabled value="">Choose project</option>
        <option
          v-for="project in this.taskStore.projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>

      <div>
        тут планирую выводить информацию по проекту (отчётный период и может быть какую-нибудь информацию по проекту)
      </div>

  </div>
</template>
