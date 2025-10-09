import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";


export const useUserStore = defineStore("user", {
  state: () => ({
    fullName : '', // current user
    users: [], // all users
    user_id : '', // current user
  }),

  actions: {
    
  },
});
