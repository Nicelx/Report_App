<script>
import { mapStores } from "pinia";
import { timestampToDate } from "@/utils/util";

import {
  useTaskStore,
  useControlsStore,
  // useCoordinatorStore,
  useReportStore,
} from "@/stores";
import ReportItem from "@/components/ReportItem.vue";

export default {
  data() {
    return {
      message: "",
    };
  },
  components: {
    ReportItem,
  },

  computed: {
    ...mapStores(
      useTaskStore,
      useControlsStore,
      // useCoordinatorStore,
      useReportStore
    ),
    fromReadable() {
      return timestampToDate(this.reportStore.from);
    },
    toReadable() {
      return timestampToDate(this.reportStore.to);
    },
  },
  methods: {
    sendReport() {
      console.log("report send");
      console.log(this.reportStore.computeDates());
      // this.reportStore.previousWeek();
      
    },
  },
  mounted() {
    (async () => {
      await this.taskStore.getInfo();
      this.reportStore.computeDates();
      this.reportStore.loadProjectsForPeriod();
    })();
  },
  beforeUpdate() {
    this.reportStore.fillReportsFromProjects();
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Week Report</h1>

    <p class="title-secondary m2">
      Период с {{ fromReadable }} до
      {{ toReadable }}
    </p>
    <div class="m2 row">
      <button @click="this.reportStore.previousWeek()" class="btn btn-outline">
        Предыдущая неделя
      </button>
      <button @click="this.reportStore.nextWeek()" class="btn btn-outline">
        Следующая неделя
      </button>
    </div>

    <div class="report-list">
      <div
        v-for="projectId in Object.keys(this.reportStore.projectsObj)"
        :key="projectId"
        class="report-item m2"
      >
        <ReportItem
          :projectId="projectId"
        />
      </div>
    </div>
    <button class="btn btn-accent" @click="sendReport">Send Report</button>
  </div>
</template>