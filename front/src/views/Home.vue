<script>
import { mapStores } from "pinia";

import Tasks from "@/components/Tasks.vue";

import { useTaskStore } from "@/stores";
import { getDatetime } from "@/utils/util";


export default {
  data() {
    return {
      isAddOpen: false,
      isEditOpen: false,
      taskDescription: "",
      taskDate: new Date().toISOString().slice(0, 10),
      message: "",
      selectedProject: "",
      selectedService: "",
    };
  },
  components: {
    Tasks,
  },

  computed: {
    // Доступ через this.taskStore
    ...mapStores( useTaskStore)
  },
  methods: {
    addTask() {
      this.taskStore.addTask({
         task_description: this.taskDescription,
          project_id: this.selectedProject,
          service_id: this.selectedService,
          completed_date: getDatetime(this.taskDate),
      })
    },
    updateTask() {
      
    },

    toggleIsAddOpen() {
      this.isAddOpen = !this.isAddOpen;
    },
  },
  mounted() {
    this.taskStore.getInfo();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Your Tasks</h1>

    <p v-if="message">{{ message }}</p>

    <button @click="toggleIsAddOpen" class="btn btn-accent m1">
      Add new task report
    </button>
    <button>Edit task</button>
    <button @click="this.taskStore.getInfo2()" class="btn btn-accent m1">
      get info2
    </button>

    <div class="add-task-block" v-if="isAddOpen">
      <input
        class="input m1"
        v-model="taskDescription"
        type="textarea"
        placeholder="task description"
      />
      <input class="input m1" v-model="taskDate" type="date" />

      <select class="select m1" v-model="selectedProject">
        <option disabled value="">Choose project</option>
        <option
          v-for="project in this.taskStore.projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>

      <select class="select m1" v-model="selectedService">
        <option disabled value="">Choose service</option>
        <option
          v-for="service in this.taskStore.services"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
      </select>

      <!-- <button @click="addTask" class="btn btn-primary m1">Add</button> -->
      <button @click="addTask" class="btn btn-primary m1">
        Add task with store
      </button>
      <button @click="updateTask">update task</button>
    </div>

    <Tasks :tasks="this.taskStore.tasks" :projects="this.taskStore.projects" />
  </div>
</template>

<!-- <div class="message message--success">Успех!</div>
    <div class="message message--success">Задача успешно создана</div>

    <div class="message message--error">Ошибка</div> -->
