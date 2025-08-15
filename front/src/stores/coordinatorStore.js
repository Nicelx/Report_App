import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { useControlsStore } from "./controlsStore";
// import { getDatetime } from "@/utils/util";

export const useCoordinatorStore = defineStore("coordinator", {
  actions: {
    addTask() {
      const taskStore = useTaskStore();
      const controls = useControlsStore();

      taskStore.addTask({
        ...controls.getFormData(),
      });
    },
    updateTask() {
      const taskStore = useTaskStore();
      const controls = useControlsStore();

      taskStore.updateTask(controls.editId, {
        ...controls.getFormData()
      })
    },
    async deleteTask() {
      const taskStore = useTaskStore();
      const controls = useControlsStore();

      await taskStore.deleteTask(controls.editId);
      controls.editClose();
    }
  },
});
