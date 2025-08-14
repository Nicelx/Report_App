import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    projects: [],
    services: [],
  }),
  actions: {
    async addTask(data) {
      const token = localStorage.getItem("authToken");
      const { id: user_id } = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:3000/add-task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          ...data,
        }),
      });

      await this.updateTasks();
    },

    async getInfo() {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/get-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

      this.tasks = data;
    },
  },
});
