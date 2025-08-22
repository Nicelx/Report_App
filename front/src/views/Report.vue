<script>
import { mapStores } from "pinia";
import { getWeekTimeRange, isInRange, timestampToDate } from "@/utils/util";

import Tasks from "@/components/Tasks.vue";

import { useTaskStore, useControlsStore, useCoordinatorStore } from "@/stores";

export default {
  data() {
    return {
      now : new Date(),
      message: "",
      from: '',
      to: '',
    };
  },
  components: {
    Tasks,
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useCoordinatorStore),
    fromReadable() {
      return timestampToDate(this.from)
    },
    toReadable() {
      return timestampToDate(this.to)
    }
  },
  methods: {
    computeDates() {
      const now = new Date();

      const { from, to } = getWeekTimeRange(now);
      this.from = from;
      this.to = to;
      console.log(from, to);

      const inRangeTasks = this.taskStore.tasks.filter((item) => {
        const taskTime = new Date(item.completed_date);
        return isInRange(taskTime, from, to);
      });

      // console.log("in Range Tasks", inRangeTasks);
      // console.log("task original", this.taskStore.tasks);
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
  <button class = "btn btn-outline">Я оладушек откати на неделю назад</button>
  <p></p>
  <!-- <button @click="filterDates">sdfsdf</button> -->
</template>
