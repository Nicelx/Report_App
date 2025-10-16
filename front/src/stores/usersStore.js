import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { fetchWithAuth } from "@/utils/api";

export const useUsersStore = defineStore("users", {
  state: () => ({
    currentUser: {},
    users: [],
    selectedServices: [],
    selectedProjects: [],
  }),

  actions: {
    getUser(id) {
      return this.users.find((user) => {
        return user.id == id;
      });
    },

    setCurrentUser() {
      const item = JSON.parse(localStorage.getItem("user"));
      this.currentUser = this.getUser(item.id);
      this.loadSelected();
    },

    saveSelected() {
      const servicesStr = JSON.stringify(this.selectedServices);
      localStorage.setItem("selectedServices", servicesStr);

      const projectsStr = JSON.stringify(this.selectedProjects);
      localStorage.setItem("selectedProjects", projectsStr);
    },

    loadSelected() {
      const storedServicesString = localStorage.getItem("selectedServices");

      if (storedServicesString) {
        this.selectedServices = JSON.parse(storedServicesString);
      }

      const storedProjectsString = localStorage.getItem("selectedProjects");

      if (storedProjectsString) {
        this.selectedProjects = JSON.parse(storedProjectsString);
      }
    },

    async updateUser() {
      this.saveSelected();

      const response = await fetchWithAuth(
        "http://localhost:3000/update-user",
        {
          method: "PUT",
          body: JSON.stringify({
            user_id: this.currentUser.id,
            email: this.currentUser.email,
            fullname: this.currentUser.fullname,
          }),
        }
      );
    },
  },
});
