<script>
import Tasks from "@/components/Tasks.vue";
export default {
  data() {
    return {
      isAddOpen: false,
      taskDescription: "",
      taskDate: this.getDate(),
      message: "",
      selectedProject: "",
      selectedService: "",
      projects: [],
      services: [],
      tasks: [],
    };
  },
  components: {
    Tasks,
  },
  methods: {
    async getTasks() {
      console.log("here full list of tasks");
    },

    getDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    async addTask() {
      const token = localStorage.getItem("authToken");
      const { id: userId } = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:3000/add-task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          task_description: this.taskDescription,
          project_id: this.selectedProject,
          service_id: this.selectedService,
          completed_date: this.taskDate,
        }),
      });

      console.log('response' ,response);

      this.updateTasks();
    },

    async getInfo() {
      const token = localStorage.getItem("authToken");
      // const { id: userId } = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:3000/get-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   user_id: userId,
        // }),
      });

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      console.log(data);

      this.projects = data.projects;
      this.services = data.services;
      this.tasks = data.tasks;
    },

    async updateTasks() {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch("http://localhost:3000/get-tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      // console.log(data);
      this.tasks = data;
    },
    toggleIsAddOpen() {
      this.isAddOpen = !this.isAddOpen;
    },
    getProjectName(projectId) {
      const project = this.projects.find((p) => p.id === projectId);
      return project ? project.name : "Неизвестный проект";
    },
  },
  mounted() {
    this.getInfo(); // Вызов метода при загрузке компонента
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
    <button @click="getInfo" class="btn btn-accent m1">get info</button>

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
          v-for="project in projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>

      <select class="select m1" v-model="selectedService">
        <option disabled value="">Choose service</option>
        <option
          v-for="service in services"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
      </select>

      <button @click="addTask" class="btn btn-primary m1">Add</button>
    </div>

    <Tasks :tasks="tasks" />

    <!-- <div class="message message--success">Успех!</div>
    <div class="message message--success">Задача успешно создана</div>

    <div class="message message--error">Ошибка</div> -->
  </div>
</template>
