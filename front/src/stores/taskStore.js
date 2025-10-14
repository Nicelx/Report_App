import { defineStore } from "pinia";
import { useUsersStore } from "./usersStore";
import { fetchWithAuth } from "@/utils/api";


export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    projects: [],
    services: [],
    projectMap: {},
    servicesMap: {},
  }),

  getters: {
    filteredServices: (state) => {
      const users = useUsersStore();

      if (users.selectedServices.length > 0) {

        // console.log(users.selectedServices);

        state.services.filter(service => {
          // console.log('service', service);
          return users.selectedServices.includes(service.id)
        });
      }

      return state.services;
    }
  },
  actions: {
    generateMaps() {
      this.projects.forEach((project) => {
        this.projectMap[project.id] = project.name;
      });
      this.services.forEach((service) => {
        this.servicesMap[service.id] = service.name;
      });
    },

    async addTask(data) {
      const { id: user_id } = JSON.parse(localStorage.getItem("user"));

      const response = await fetchWithAuth("http://localhost:3000/add-task", {
        method: "POST",
        body: JSON.stringify({
          user_id,
          ...data,
        }),
      });

      await this.updateTasks();
    },

    // init app data
    async getInfo() {
      const response = await fetchWithAuth("http://localhost:3000/get-info", {method: "GET"})

      const data = await response.json(); 

      const users = useUsersStore();

      this.projects = data.projects;
      this.services = data.services;
      this.tasks = data.tasks;
      users.users = data.users;
      users.setCurrentUser();
      this.generateMaps()
    },

    async updateTasks() {
      const response = await fetchWithAuth("http://localhost:3000/get-tasks", {
        method: "GET",
      });

      const data = await response.json();

      this.tasks = data;
    },

    async updateTask(taskId, taskData) {
      const response = await fetchWithAuth(
        `http://localhost:3000/update-task/${taskId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: taskId,
            ...taskData,
          }),
        }
      );

      await this.updateTasks();
    },

    async deleteTask(taskId) {
      // const token = localStorage.getItem("authToken");

      const response = await fetchWithAuth(
        `http://localhost:3000/delete-task/${taskId}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            id: taskId,
          }),
        }
      );

      await this.updateTasks();
    },

    getTaskById(id) {
      return this.tasks.find((task) => task.id == id);
    },
  },
});
