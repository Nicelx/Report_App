import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    projects: [],
    services: [],
    projectMap: {}
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

      this.projects = data.projects;
      this.services = data.services;
      this.tasks = data.tasks;

      this.projects.forEach((project) => {
        this.projectMap[project.id] = project.name;
      });
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

    async updateTask(taskId, taskData) {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:3000/update-task/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: taskId,
            ...taskData,
          }),
        }
      );

      await this.updateTasks();
    },

    async deleteTask(taskId) {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:3000/delete-task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: taskId,
            message: 'lets delete it',
          }),
        }
      );

      await this.updateTasks();
    },

    getTaskById(id) {
      return this.tasks.find((task) => task.id == id);
    },
    // getTasks
  },
});
