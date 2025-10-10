import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";


export const useUsersStore = defineStore("users", {
  state: () => ({
    fullName : '', // current user
    users: [], // all users id, fullname, email
    user_id : '', // current user
  }),

  actions: {
    getUser(id) {
      
    }
  },
});
