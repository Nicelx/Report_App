<script>
import { mapStores } from "pinia";

import Tasks from "@/components/Tasks.vue";

import {
  useTaskStore,
  useControlsStore,
  useCoordinatorStore,
  useUsersStore,
} from "@/stores";

export default {
  data() {
    return {
      message: "",
    };
  },
  components: {
    Tasks,
  },

  computed: {
    ...mapStores(
      useTaskStore,
      useControlsStore,
      useCoordinatorStore,
      useUsersStore
    ),

    addNewText() {
      if (this.controlsStore.isControlsOpen) {
        return "Close";
      } else {
        return "Add new task report";
      }
    },
    isExtraService() {
      return (
        this.controlsStore.selectedService &&
        !this.taskStore.filteredServices.find(
          (s) => s.id === this.controlsStore.selectedService
        )
      );
    },
    isExtraProject() {
      return (
        this.controlsStore.selectedProject &&
        !this.taskStore.filteredProjects.find(
          (s) => s.id === this.controlsStore.selectedService
        )
      );
    },
  },
  methods: {},
  mounted() {
    this.taskStore.getInfo();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Your Tasks</h1>

    <p v-if="message">{{ message }}</p>

    <button @click="this.controlsStore.newTask" class="btn btn-accent m1">
      {{ addNewText }}
    </button>

    <div
      id="addTaskBlock"
      class="add-task-block"
      v-if="this.controlsStore.isControlsOpen"
    >
      <!-- <input -->
      <textarea
        class="input m1"
        v-model="this.controlsStore.taskDescription"
        placeholder="task description"
        rows="3"
      ></textarea>

      <input
        class="input m1"
        v-model="this.controlsStore.taskDate"
        type="date"
      />

      <select class="select m1" v-model="this.controlsStore.selectedProject">
        <option disabled value="">Choose project</option>
        <option
          v-for="project in this.taskStore.filteredProjects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
        <option
          v-if="isExtraProject"
          :value="this.controlsStore.selectedProject"
        >
          {{ this.taskStore.projectMap[this.controlsStore.selectedProject] }}
          (Проект скрыт в настройках)
        </option>
      </select>

      <select class="select m1" v-model="this.controlsStore.selectedService">
        <option disabled value="">Choose service</option>
        <option
          v-for="service in this.taskStore.filteredServices"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
        <option
          v-if="isExtraService"
          :value="this.controlsStore.selectedService"
        >
          {{ this.taskStore.servicesMap[this.controlsStore.selectedService] }}
          (Услуга скрыта в настройках)
        </option>
      </select>

      <div class="row">
        <button
          v-if="this.controlsStore.mode == 'create'"
          @click="this.coordinatorStore.addTask"
          class="btn btn-primary m1"
        >
          Add new task
        </button>
        <button
          v-if="this.controlsStore.mode == 'edit'"
          @click="this.coordinatorStore.updateTask"
          class="btn btn-primary m1"
        >
          Save edited task id:{{ this.controlsStore.editId }}
        </button>
        <button
          v-if="this.controlsStore.mode == 'edit'"
          @click="this.controlsStore.editClose()"
          class="btn btn-outline m1"
        >
          Close edititng
        </button>
        <button
          v-if="this.controlsStore.mode == 'edit'"
          @click="this.taskStore.deleteTask(this.controlsStore.editId)"
          class="btn btn-secondary m1"
        >
          Delete
        </button>
      </div>
    </div>

    <Tasks :tasks="this.taskStore.tasks" :projects="this.taskStore.projects" />
  </div>
</template>
