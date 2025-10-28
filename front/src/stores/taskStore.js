import { defineStore } from "pinia";
import { useUsersStore } from "./usersStore";
import { useMessageStore } from "./messageStore";
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

      if (users.selectedServices && users.selectedServices.length > 0) {
        const filteredServices = state.services.filter((service) => {
          return users.selectedServices.includes(service.id);
        });

        return filteredServices;
      }

      return state.services;
    },
    filteredProjects: (state) => {
      const users = useUsersStore();

      if (users.selectedProjects && users.selectedProjects.length > 0) {
        const filteredProjects = state.projects.filter((project) => {
          return users.selectedProjects.includes(project.id);
        });

        return filteredProjects;
      }

      return state.projects;
    },
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
      const message = useMessageStore();
      try {
        const response = await fetchWithAuth("http://localhost:3000/add-task", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (response.status === 200) {
          message.success("Задача успешно добавлена");
          await this.updateTasks();
        } else {
          throw new Error("Не удалось добавить задачу");
        }
      } catch (error) {
        message.error(error.message);
      }
    },

    // init app data
    async getInfo() {
      const response = await fetchWithAuth("http://localhost:3000/get-info", {
        method: "GET",
      });

      const data = await response.json();

      const users = useUsersStore();

      this.projects = data.projects;
      this.services = data.services;
      this.tasks = data.tasks;
      users.users = data.users;
      users.setCurrentUser();
      this.generateMaps();
    },

    async updateTasks() {
      const response = await fetchWithAuth("http://localhost:3000/get-tasks", {
        method: "GET",
      });

      const data = await response.json();

      this.tasks = data;
    },

    async updateTask(taskId, taskData) {
      const message = useMessageStore();

      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/update-task/${taskId}`,
          {
            method: "PUT",
            body: JSON.stringify(taskData),
          }
        );

        if (response.ok) {
          message.success("Задача обновлена");
          await this.updateTasks();
        } else {
          message.error(response.status);
        }
      } catch (error) {
        message.error("ошибка", error.message);
      }
    },

    async deleteTask(taskId) {
      const message = useMessageStore();
      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/delete-task/${taskId}`,
          {
            method: "DELETE",
          }
        );

        if (response.status == 200) {
          message.success("Задача удалена");
        } else {
          throw new Error('Ошибка ответа сервера!')
        }

        await this.updateTasks();
      } catch (error) {
        message.error(error.message);
      }
    },

    getTaskById(id) {
      return this.tasks.find((task) => task.id == id);
    },
  },
});
