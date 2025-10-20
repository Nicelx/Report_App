<script>
import { mapStores } from "pinia";
import { timestampToDate } from "@/utils/util";

import { useTaskStore, useControlsStore, useReportStore } from "@/stores";
import ReportItem from "@/components/ReportItem.vue";

export default {
  data() {
    return {
      message: "",
      projectId: "",
      from: "",
      to: '',
    };
  },
  components: {
    ReportItem,
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useReportStore),
    fromReadable() {
      return timestampToDate(this.reportStore.from);
    },
    toReadable() {
      return timestampToDate(this.reportStore.to);
    },
  },
  methods: {
    
    // resetFields() {
    //   this.reportStore.isTouched = false;
    // },
  },
  mounted() {
    (async () => {
      await this.taskStore.getInfo();
      this.reportStore.computeDates();
      this.reportStore.findTasksInRange();
    })();
  },
  
  watch: {
    projectId(newVal, oldVal) {
      console.log("watch triggered", newVal, oldVal);
      if (newVal && newVal !== oldVal) {
        this.reportStore.fillReport(newVal);
      }
    },
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
        @click="this.reportStore.previousWeek()"
        class="btn btn-accent"
      >
        Предыдущая неделя
      </button>
      <button
        @click="this.reportStore.nextWeek()"
        class="btn btn-accent"
      >
        Следующая неделя
      </button>
      <button
        class="btn btn-accent"
        @click="resetFields()"
        v-if="this.reportStore.isTouched"
      >
        Reset Report
      </button>
    </div>

    <div class="m2">
      Найдены задачи по следующим проектам за выбранный период:
      <p v-for="project in this.reportStore.projectsInRange">
        - {{ this.taskStore.projectMap[project] }}
      </p>
    </div>
    <div>
      Выберите проект:
      <select class="select m2" v-model="this.projectId">
        <option disabled value="">Choose project</option>
        <option
          v-for="project in this.taskStore.filteredProjects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
    </div>

    <ReportItem :projectId="projectId" />

    <p
      class="m2"
      :style="{
        color: this.reportStore.isDataValid ? '#00ff95' : 'red',
        fontSize: '20px',
      }"
    >
      {{ this.reportStore.statusMessage }}
    </p>
    <button class="btn btn-accent" @click="this.reportStore.sendReport">
      Send Report
    </button>
    <!-- <button
      class="btn btn-accent"
      @click="
        () => {
          this.reportStore.addReportToFill(3);
        }
      "
    >
      Add report to fill
    </button> -->
  </div>
</template>
