<!-- тут общая справка по проекту, плюс редактирование проектов если будет нужно -->
<!-- подумать как хранить текст в базе данных -->
<script>
import { mapStores } from "pinia";

import {
  useTaskStore,
  useControlsStore,
  useCoordinatorStore,
  useReportStore,
  useUsersStore,
} from "@/stores";
import ReportCard from "@/components/ReportCard.vue";
import { getMonthTimeRange, getWeekTimeRange } from "@/utils/util";

export default {
  data() {
    return {
      message: "",
      projectId: null,
      selectedPeriod: "",
      selectedUser: null,
      from: "",
      to: "",
      customFrom: "",
      customTo: "",
    };
  },

  methods: {
    onPeriodChange() {
      const date = new Date();
      if (this.selectedPeriod === "week") {
        const range = getWeekTimeRange(date);
        this.from = range.from;
        this.to = range.to;
        return;
      }
      if (this.selectedPeriod === "last_week") {
        date.setDate(date.getDate() - 7);
        const range = getWeekTimeRange(date);
        this.from = range.from;
        this.to = range.to;
        return;
      }
      if (this.selectedPeriod === "month") {
        const range = getMonthTimeRange(date);
        this.from = range.from;
        this.to = range.to;
        return;
      }

      if (this.selectedPeriod === "all") {
        this.from = "";
        this.to = "";
      }
    },
    onUserChange() {
      // console.log("onUserChange()");
      // if (this.projectId) {
      this.fetchProjectReports();
      // }
    },
    fetchProjectReports() {
      const filters = {};
      if (this.projectId) {
        filters.project_id = this.projectId;
      }

      if (this.from) {
        filters.from = this.from;
      }

      if (this.to) {
        filters.to = this.to;
      }
      if (this.selectedUser) {
        filters.user_id = this.selectedUser;
      }

      this.reportStore.getReports(filters);
      console.log("FETCH PROJECTREPORTS");
    },
  },
  components: {
    ReportCard,
  },
  watch: {
    projectId(newProjectId) {
      // if (newProjectId) {
      this.fetchProjectReports();
      // }
    },
    from(newFrom) {
      // if (this.projectId) {
      this.fetchProjectReports();
      // }
    },
    to(newTo) {
      if (this.selectedPeriod === "custom") {
        this.fetchProjectReports();
      }
    },
    customFrom(newStr) {
      const date = new Date(newStr);
      date.setHours(0, 0, 0, 0);
      this.from = date.getTime(date);
    },
    customTo(newStr) {
      const date = new Date(newStr);
      date.setHours(23, 59, 59, 999);
      this.to = date.getTime(date);
    },
  },
  mounted() {
    this.taskStore.getInfo();
    this.reportStore.computeDates();
    console.log(this.reportStore.from, " ", this.reportStore.to);
    // this.fetchProjectReports();
  },

  computed: {
    ...mapStores(
      useTaskStore,
      useControlsStore,
      useCoordinatorStore,
      useReportStore,
      useUsersStore
    ),
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Проекты и отчёты по ним</h1>

    <select class="select m1" v-model="this.projectId">
      <option disabled value="null">Выберите проект</option>
      <option value="">Все проекты</option>
      <option
        v-for="project in this.taskStore.filteredProjects"
        :key="project.id"
        :value="project.id"
      >
        {{ project.name }}
      </option>
    </select>

    <select class="select m1" v-model="selectedPeriod" @change="onPeriodChange">
      <option disabled value="">Выберите период</option>
      <option value="week">Текущая неделя</option>
      <option value="last_week">Прошлая неделя</option>
      <option value="month">Текущий месяц</option>
      <option value="all">За весь период</option>
      <option value="custom">Произвольный период</option>
    </select>

    <div v-if="selectedPeriod === 'custom'" class="custom-range">
      <input type="date" class="input m1" v-model="customFrom" />
      <input type="date" class="input m1" v-model="customTo" />
    </div>

    <p v-if="message">{{ message }}</p>

    <select class="select m1" v-model="selectedUser" @change="onUserChange">
      <option disabled value="null">Пользователи</option>
      <option value="">Все</option>
      <option
        v-for="user in this.usersStore.users"
        :key="user.id"
        :value="user.id"
      >
        {{ user.fullname ? user.fullname : user.username }}
      </option>
    </select>

    <ReportCard
      v-for="report in this.reportStore.loadedReports"
      :key="report.id"
      :report-data="report"
    />
  </div>
</template>
