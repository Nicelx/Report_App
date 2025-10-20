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
import { getMonthTimeRange, getWeekTimeRange } from "@/utils/util";

export default {
  data() {
    return {
      message: "",
      projectId: "",
      selectedPeriod: "",
      from: "",
      to: "",
    };
  },

  methods: {
    onPeriodChange() {
      const date = new Date();
      if (this.selectedPeriod === "week") {
        const range = getWeekTimeRange(date);
        this.from = range.from;
        this.to = range.to
        return;
      }
      if (this.selectedPeriod === "last_week") {
        date.setDate(date.getDate() - 7);
        const range = getWeekTimeRange(date);
        this.from = range.from;
        this.to = range.to
        return;
      }
      if (this.selectedPeriod === "month") { 
        const range = getMonthTimeRange(date);
        this.from = range.from;
        this.to = range.to
        return;
      }
      
      if (this.selectedPeriod === "all") {
        this.from = "";
        this.to = "";
      }


    },
    fetchProjectReports() {
      const filters = {
        project_id: this.projectId,
      };

      if (this.from) {
        filters.from = this.from;
      }

      if (this.to) {
        filters.to = this.to;
      }

      this.reportStore.getReports(filters);
      console.log('FETCH PROJECTREPORTS')
    },
  },
  components: {
    ReportCard,
  },
  watch: {
    projectId(newProjectId) {
      if (newProjectId) {
        this.fetchProjectReports();
      }
    },
    from(newFrom) {
      if (this.projectId) {
        console.log(newFrom, 'newFrom');
        this.fetchProjectReports();
      }
    },
    to(newTo) {
      if (this.projectId && this.selectedPeriod === 'custom') {
        console.log('to triggers', newTo);
        this.fetchProjectReports();
      }
    }
  },
  mounted() {
    this.taskStore.getInfo();
    this.reportStore.computeDates();
    console.log(this.reportStore.from, " ", this.reportStore.to);
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

    <select class="select m1" v-model="selectedPeriod" @change="onPeriodChange">
      <option disabled value="">Выберите период</option>
      <option value="week">Текущая неделя</option>
      <option value="last_week">Прошлая неделя</option>
      <option value="month">Текущий месяц</option>
      <option value="all">За весь период</option>
      <option value="custom">Произвольный период</option>
      <!-- 
      <option value="last_month">Прошлый месяц</option>
      <option value="quarter">Текущий квартал</option> -->
      
    </select>

    <div v-if="selectedPeriod === 'custom'" class="custom-range">
      <input type="date" class="input m1" v-model="from" />
      <input type="date" class="input m1" v-model="to" />
    </div>

    <p v-if="message">{{ message }}</p>

    <select class="select m1" v-model="this.projectId">
      <option disabled value="">Choose project</option>
      <option
        v-for="project in this.taskStore.filteredProjects"
        :key="project.id"
        :value="project.id"
      >
        {{ project.name }}
      </option>
    </select>
    <button class="btn btn-accent m2" @click="fetchProjectReports">
      fetch
    </button>
    <ReportCard
      v-for="report in this.reportStore.loadedReports"
      :key="report.id"
      :report-data="report"
    />
  </div>
</template>
