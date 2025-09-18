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
      projectsObj: {},
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
    },
    nextWeek() {
      this.now = new Date(this.now.getTime() + 7 * 24 * 60 * 60 * 1000);
      this.computeDates();
      this.reportProjects();
    },
    computeDates() {
      const { from, to } = getWeekTimeRange(this.now);
      this.from = from;
      this.to = to;
    },
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
    },
  },
  mounted() {
    (async () => {
      await this.taskStore.getInfo();
      console.log(this.taskStore.projectMap[1], 'project Map');
      await this.computeDates();
      await this.reportProjects();
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
    Предыдущая неделя
  </button>
  <button @click="nextWeek()" class="btn btn-outline">Следующая неделя</button>

  <div class="report-list">
    <div
      v-for="projectId in Object.keys(projectsObj)"
      :key="projectId"
      class="report-item"
    >
      <p>Project: {{  projectsObj[projectId] }}</p>
      <div v-for="task in projectsObj[projectId]">
          {{ task.task_description }}
      </div>
      <!-- {{ projectsObj[projectId] }} -->
      <hr />
    </div>
  </div>
</template>
