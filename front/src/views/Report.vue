<script>
import { mapStores } from "pinia";
import { getWeekTimeRange, isInRange, timestampToDate } from "@/utils/util";

import Tasks from "@/components/Tasks.vue";

import { useTaskStore, useControlsStore, useCoordinatorStore } from "@/stores";

export default {
  data() {
    return {
      now: new Date(),
      message: "",
      from: "",
      to: "",
    };
  },
  components: {
    Tasks,
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useCoordinatorStore),
    fromReadable() {
      return timestampToDate(this.from);
    },
    toReadable() {
      return timestampToDate(this.to);
    },
  },
  methods: {
    previousWeek() {
      this.now = new Date(this.now.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.computeDates();
    },
    nextWeek() {
      this.now = new Date(this.now.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.computeDates();
    },
    computeDates() {
      const { from, to } = getWeekTimeRange(this.now);
      this.from = from;
      this.to = to;

      const inRangeTasks = this.taskStore.tasks.filter((item) => {
        const taskTime = new Date(item.completed_date);
        return isInRange(taskTime, from, to);
      });
    },
  },
  mounted() {
    (async () => {
      await this.taskStore.getInfo();
      await this.computeDates();
    })();
  },
};
</script>

<template>
  <h1 class="title m3">Week Report</h1>

  <p class="title-secondary m2">
    тут собираем таски за период с {{ fromReadable }} -
    {{ toReadable }}
  </p>
  <button @click="previousWeek()" class="btn btn-outline">
    Я оладушек откати на неделю назад
  </button>
  <button @click="nextWeek()" class="btn btn-outline">
    Следующая неделя
  </button>
  <p>
    

  </p>
</template>
