import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    projects: [],
    services: [],
  }),
  actions: {
    addTask() {
      // тут я хочу испльзовать counter из exampleStore.js
      counter = null;
      this.tasks.push(counter);
    },

    async getInfo2() {
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
  },
});
