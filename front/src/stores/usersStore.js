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
      console.log(this.selectedServices, 'selectedServices');
    },

    saveSelected(servicesArr, projectsArr) {
      const servicesStr = JSON.stringify(servicesArr);
      localStorage.setItem("selectedServices", servicesStr);
      this.selectedServices = servicesArr;


      // const projectsStr = JSON.stringify(projectsArr);
      // localStorage.setItem("selectedProjects", projectsStr);
      // this.selectedProjects = projectsArr;
    },

    loadSelected() {
      const storedServicesString = localStorage.getItem("selectedServices");
      this.selectedServices = JSON.parse(storedServicesString);
      // this.selectedServices.forEach(item => {
      //   console.log('item counte')
      // })

      // storedServicesString.forEach(() => {
      //   console.log('item count2');
      // })

      // console.log(storedServicesString, '111');
      // console.log(this.selectedServices, '222');
      // console.log(JSON.parse(storedServicesString), 'json.parse')

      // const storedProjectsString = localStorage.getItem("selectedProjects");
      // this.selectedProjects = JSON.parse(storedProjectsString);
    },

    async updateUser(data) {
      this.selectedServices = data.selectedServices;
      this.saveSelected(data.selectedServices)

      const response = await fetchWithAuth(
        "http://localhost:3000/update-user",
        {
          method: "PUT",
          body: JSON.stringify({
            user_id: this.currentUser.id,
            ...data,
          }),
        }
      );
    },
  },
});
