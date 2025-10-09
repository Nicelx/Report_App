<!-- тут общая справка по проекту, плюс редактирование проектов если будет нужно -->
<!-- подумать как хранить текст в базе данных -->
<script>
import { mapStores } from "pinia";

import {
  useTaskStore,
  useControlsStore,
  useCoordinatorStore,
  useReportStore,
} from "@/stores";
import ReportCard from "@/components/ReportCard.vue";

export default {
  data() {
    return {
      message: "",
    };
  },

  methods: {
    fetchProjectReports() {
      this.reportStore.getReports({
        project_id: 2,
        from: this.reportStore.from,
      });
    },
  },
 components: {
    ReportCard,
  },
  mounted() {
    this.taskStore.getInfo();
    this.reportStore.computeDates();
    console.log(this.reportStore.from, " ", this.reportStore.to);
    // this.reportStore.getMyReports();
  },
  computed: {
    ...mapStores(
      useTaskStore,
      useControlsStore,
      useCoordinatorStore,
      useReportStore
    ),
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Проекты Malina Clinic</h1>

    <p v-if="message">{{ message }}</p>

    <select class="select m1" v-model="this.controlsStore.selectedProject">
      <option disabled value="">Choose project</option>
      <option
        v-for="project in this.taskStore.projects"
        :key="project.id"
        :value="project.id"
      >
        {{ project.name }}
      </option>
    </select>
    <button class="btn btn-accent m2" @click="fetchProjectReports">fetch</button>
      <ReportCard
        v-for="report in this.reportStore.loadedReports"
        :key="report.id"
        :report-data="report"
      />
  </div>
</template>

