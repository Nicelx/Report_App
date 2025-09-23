import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";

const FULL_WEEK_MS = 604800000;

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: {},
    isTouched: false,
    now: new Date(),
    dynamicNow: "",
    from: "",
    to: "",
    timeIndex: 0,
    // property timeIndex and value is Objects to currentTime
    projectsObj: {},
  }),

  actions: {
    updateReport(projectId, data) {
      this.reports[projectId] = { ...this.reports[projectId], ...data };
    },
    computeDates() {
      const dateObj = this.dynamicNow ? this.dynamicNow : this.now;
      const { from, to } = getWeekTimeRange(dateObj);

      console.log(from, to, "from-to");

      this.from = from;
      this.to = to;
    },
    previousWeek() {
      this.dynamicNow = new Date(
        this.now.getTime() + FULL_WEEK_MS * --this.timeIndex
      );
      this.computeDates();
      // this.reportProjects();
    },
    nextWeek() {
      this.dynamicNow = new Date(
        this.now.getTime() + FULL_WEEK_MS * ++this.timeIndex
      );
      this.computeDates();
      // this.reportProjects();
    },

    reportProjects() {
      console.log("report Projects mounted");
      this.projectsObj = {};

      // this.tasksInRange.forEach((task) => {
      //   const { project_id } = task;
      //   if (!this.projectsObj[project_id]) {
      //     this.projectsObj[project_id] = [];
      //   }
      //   this.projectsObj[project_id].push(task);
      // });
      // console.log('this.projectsObj', this.projectsObj);
    },

    tasksInRange() {
      return this.taskStore.tasks.filter((item) => {
        if (!item.completed_date) return false;

        const taskTime = new Date(item.completed_date);
        return isInRange(taskTime.getTime(), this.from, this.to);
      });
    },
  },
});
