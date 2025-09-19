import { defineStore } from "pinia";

const FULL_WEEK_MS = 604800000;

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: {},
    isTouched: false,
    now: new Date(),
    from: '',
    to: '',
  }),

  actions: {
    updateReport(projectId, data) {
      this.reports[projectId] = { ...this.reports[projectId], ...data };
    },
  },
});
