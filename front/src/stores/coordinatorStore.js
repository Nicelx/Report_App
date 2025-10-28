import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { useControlsStore } from "./controlsStore";
import { useMessageStore } from "./messageStore";
// import { getDatetime } from "@/utils/util";

export const useCoordinatorStore = defineStore("coordinator", {
  actions: {
    addTask() {
      const message = useMessageStore();
      try {
        const taskStore = useTaskStore();
        const controls = useControlsStore();

        taskStore.addTask({
          ...controls.getFormData(),
        });
        controls.resetFields();
      } catch (error) {
        message.error(error.message);
      }
    },
    updateTask() {
      const message = useMessageStore();

      try {
        const taskStore = useTaskStore();
        const controls = useControlsStore();

        taskStore.updateTask(controls.editId, {
          ...controls.getFormData(),
        });
        controls.resetFields();
      } catch (error) {
        message.error(error.message);
      }
    },
    async deleteTask() {
      const message = useMessageStore();

      try {
        const taskStore = useTaskStore();
        const controls = useControlsStore();

        await taskStore.deleteTask(controls.editId);

        controls.editClose();
        controls.resetFields();
      } catch (error) {
        message.error(error.message);
      }
    },
  },
});
