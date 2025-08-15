import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { getDatetime } from "@/utils/util";

export const useControlsStore = defineStore("controls", {
  state: () => ({
    isControlsOpen: false,
    editId: null,
    taskDescription: "",
    selectedProject: "",
    selectedService: "",
    taskDate: new Date().toISOString().slice(0, 10),
    mode: 'create'
  }),
  actions: {
    newTask() {
      if (this.mode == 'edit') {
        this.mode = 'create';
      }
      this.isControlsOpen = !this.isControlsOpen;
      this.editId = null;
    },
    getFormData() {
      return {
        task_description: this.taskDescription,
        project_id: this.selectedProject,
        service_id: this.selectedService,
        completed_date: getDatetime(this.taskDate),
      };
    },
    editOpen(taskId) {
      const taskStore = useTaskStore();
      const task = taskStore.getTaskById(taskId);

      this.isControlsOpen = true;
      this.mode = 'edit';
      this.editId = taskId;

      this.taskDescription = task.task_description;
      this.selectedProject = task.project_id;
      this.selectedService = task.service_id;
      this.taskDate = task.completed_date.slice(0, 10);
    },
    editClose() {
      this.isControlsOpen = false;
      this.mode = 'create';
      this.editId = null;
    },
  },
});
