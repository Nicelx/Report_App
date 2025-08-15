import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { getDatetime } from "@/utils/util";

// const taskStore = useTaskStore();

export const useControlsStore = defineStore("controls", {
  state: () => ({
    isControlsOpen: false,
    isEditOpen: false,
    editId: null,
    taskDescription: "",
    selectedProject: "",
    selectedService: "",
    taskDate: new Date().toISOString().slice(0, 10),
  }),
  actions: {
    newTask() {
      this.editId = null;
      this.isEditOpen = false;

      if (this.isControlsOpen == false) {
        this.isControlsOpen = true;
      } else {
        this.isControlsOpen = false;
      }
    },
    editOpen(taskId) {
      const taskStore = useTaskStore();
      const task = taskStore.getTaskById(taskId);

      this.isControlsOpen = true;
      this.isEditOpen = true;
      this.editId = taskId;

      this.taskDescription = task.task_description;
      this.selectedProject = task.project_id;
      this.selectedService = task.service_id;
      this.taskDate = task.completed_date.slice(0, 10);
    },
    editClose() {
      this.isControlsOpen = false;
      this.isControlsOpen = false;
      this.editId = null;
    },
    saveEdit() {
      const taskStore = useTaskStore();
      taskStore.updateTask(this.editId, {
        task_description: this.taskDescription,
        project_id: this.selectedProject,
        service_id: this.selectedService,
        completed_date: getDatetime(this.taskDate),
      });
    },
  },
  getters: {},
});
