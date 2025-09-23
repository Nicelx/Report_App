<script>
import { mapStores } from "pinia";
import { getWeekTimeRange, isInRange, timestampToDate } from "@/utils/util";

import { useTaskStore, useControlsStore, useCoordinatorStore, useReportStore } from "@/stores";
import ReportItem from "@/components/ReportItem.vue";

export default {
  data() {
    return {
      now: new Date(),
      message: "",
      from: "",
      to: "",
      projectsObj: {},
      reportIndex: 0
    };
  },
  components: {
    ReportItem,
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useCoordinatorStore, useReportStore),
    fromReadable() {
      return timestampToDate(this.from);
    },
    toReadable() {
      return timestampToDate(this.to);
    },
    tasksInRange() {
      return this.taskStore.tasks.filter((item) => {
        if (!item.completed_date) return false;

        const taskTime = new Date(item.completed_date);
        return isInRange(taskTime.getTime(), this.from, this.to);
      });
    },
  },
  methods: {
    previousWeek() {
      this.now = new Date(this.now.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.computeDates();
      this.reportProjects();

      this.reportStore.previousWeek();
    },
    nextWeek() {
      this.now = new Date(this.now.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.computeDates();
      this.reportProjects();

      this.reportStore.nextWeek();
    },
    computeDates() {
      const { from, to } = getWeekTimeRange(this.now);
      this.from = from;
      this.to = to;
    },
    // сортировка проектов под каждый проект с тасками
    reportProjects() {
      console.log("report Projects mounted");
      this.projectsObj = {};

      this.tasksInRange.forEach((task) => {
        const { project_id } = task;
        if (!this.projectsObj[project_id]) {
          this.projectsObj[project_id] = [];
        }
        this.projectsObj[project_id].push(task);
      });
      // console.log('this.projectsObj', this.projectsObj);
    },
    sendReport() {
      console.log('report send');
      console.log(this.reportStore.computeDates());
      this.reportStore.previousWeek();
    }
  },
  mounted() {
    (async () => {
      
      await this.taskStore.getInfo();
      await this.computeDates();
      await this.reportProjects();

      // this.reportStore.computeDates();
      // console.log(this.reportStore.from, 'from this.reportStore')
    })();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Week Report</h1>

    <button @click="this.sendReport">sdf</button>

    <p class="title-secondary m2">
      тут собираем таски за период с {{ fromReadable }} -
      {{ toReadable }}
    </p>
    <div class="m2 row">
      <button @click="previousWeek()" class="btn btn-outline">
        Предыдущая неделя
      </button>
      <button @click="nextWeek()" class="btn btn-outline">
        Следующая неделя
      </button>
    </div>

    <div class="report-list">
      <div
        v-for="projectId in Object.keys(projectsObj)"
        :key="projectId"
        class="report-item"
      >
        <!-- <ReportItem :tasksArray="projectsObj[projectId]" /> -->
        <hr />
      </div>
    </div>
    <button  class="btn btn-accent" @click="sendReport">Send Report</button>
  </div>
</template>
