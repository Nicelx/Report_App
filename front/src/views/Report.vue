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
      // isReportValid:false
    };
  },
  components: {
    ReportItem,
  },

  computed: {
    ...mapStores(
      useTaskStore,
      useControlsStore,
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
    resetFields() {
      this.reportStore.fillReportsFromProjects();
      this.reportStore.isTouched = false;
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
    if (!this.reportStore.isTouched) {
      this.reportStore.fillReportsFromProjects();
    }
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
      <button
        v-if="!this.reportStore.isTouched"
        @click="this.reportStore.previousWeek()"
        class="btn btn-accent"
      >
        Предыдущая неделя
      </button>
      <button
        v-if="!this.reportStore.isTouched"
        @click="this.reportStore.nextWeek()"
        class="btn btn-accent"
      >
        Следующая неделя
      </button>
      <button class="btn btn-accent" @click="resetFields()" v-if="this.reportStore.isTouched">
        Reset Report
      </button>
    </div>

    <div class="report-list">
      <div
        v-for="projectId in Object.keys(this.reportStore.projectsObj)"
        :key="projectId"
        class="report-item m2"
      >
        <ReportItem :projectId="projectId" />
      </div>
    </div>
    <p class = "m2" style = "color: red; font-size: 20px;">{{ this.reportStore.statusMessage }}</p>
    <button class="btn btn-accent" @click="this.reportStore.sendReport">
      Send Report
    </button>
  </div>
</template>
