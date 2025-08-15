<script>
import { mapStores } from "pinia";

import Tasks from "@/components/Tasks.vue";

import { useTaskStore, useControlsStore } from "@/stores";
import { getDatetime } from "@/utils/util";

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
    // Доступ через this.taskStore
    ...mapStores(useTaskStore, useControlsStore),

    addNewText() {
      if (this.controlsStore.isControlsOpen) {
        return 'Close'
      } else {
        return 'Add new task report'
      }
    }
  },
  methods: {
    addTask() {
      this.taskStore.addTask({
        task_description: this.controlsStore.taskDescription,
        project_id: this.controlsStore.selectedProject,
        service_id: this.controlsStore.selectedService,
        completed_date: getDatetime(this.controlsStore.taskDate),
      });
    },

    // handleEditTask(taskId) {
    //   this.isEditOpen = true;
    //   this.editId = taskId;

    //   const task = this.taskStore.tasks.find((t) => t.id === taskId);
    //   if (task) {
    //     this.taskDescription = task.task_description;
    //     this.taskDate = task.completed_date.slice(0, 10);
    //     this.selectedProject = task.project_id;
    //     this.selectedService = task.service_id;
    //   }
    // },

    async updateTask(id) {
      // fetch(`http://localhost:3000//update-task/${id}`);

      const token = localStorage.getItem("authToken");

      const response = await fetch(`http://localhost:3000/update-task/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          task_description: "changed",
        }),
      });
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

    <button
      @click="this.controlsStore.newTask"
      class="btn btn-accent m1"
    >
      {{ addNewText }}
    </button>

    <div class="add-task-block" v-if="this.controlsStore.isControlsOpen">
      <input
        class="input m1"
        v-model="this.controlsStore.taskDescription"
        type="textarea"
        placeholder="task description"
      />
      <input class="input m1" v-model="this.controlsStore.taskDate" type="date" />

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

      <select class="select m1" v-model="this.controlsStore.selectedService">
        <option disabled value="">Choose service</option>
        <option
          v-for="service in this.taskStore.services"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
      </select>

      <button v-if="!this.controlsStore.isEditOpen" @click="addTask" class="btn btn-primary m1">Add new task</button>
      <button
        v-if="this.controlsStore.isEditOpen"
        @click="this.controlsStore.saveEdit"
        class="btn btn-primary m1"
      >
        Save edited task id:{{ this.controlsStore.editId }}
      </button>
      <button
        v-if="this.controlsStore.isEditOpen"
        @click="this.controlsStore.editClose()"
        class="btn btn-outline m1"
      >
        Close edititng
      </button>
    </div>

    <Tasks :tasks="this.taskStore.tasks" :projects="this.taskStore.projects" />
  </div>
</template>
