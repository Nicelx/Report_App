<script>
import { mapStores } from "pinia";

import Tasks from "@/components/Tasks.vue";

import { useTaskStore, useControlsStore, useCoordinatorStore } from "@/stores";

export default {
  data() {
    return {
      message: "",
    };
  },
  components: {
    Tasks,
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useCoordinatorStore),
    // filterDates() {
    //     console.log(this.taskStore.tasks[0].completed_date);

    // }
  },
  methods: {
    computeDates() {
        // 1 сегодня
        // 2 вычисляем границу
        // 3 вычисляем timestamp границ
        // 4 вычисляем timestamp проектов и фильтруем в границы

    //   const tasks = [...this.taskStore.tasks];
    //   this.tasks.push('sdfsdf');
    //   console.log(tasks);
    //   console.log(this.taskStore.tasks);

      const now = new Date();
    const dayOfTheWeek = now.getDay();
    const diffToMonday = dayOfTheWeek === 0 ? -6 : 1 - dayOfTheWeek;
    
    console.log(dayOfTheWeek);
    console.log(diffToMonday);
    // console.log(now.getUTCDay());



    //   console.log(this.taskStore.tasks);
    //   console.log(now);
      // console.log(date1);
      // console.log(date2);
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

  <div>тут собираем таски дате</div>

  <button @click="filterDates">sdfsdf</button>
</template>
