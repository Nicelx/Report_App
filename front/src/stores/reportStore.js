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
    projectsObj: {},
  }),

  actions: {
    fillReportsFromProjects() {
      this.reports = {};

      const projectIdsArray = Object.keys(this.projectsObj);
      projectIdsArray.forEach((project_id) => {
        let taskDescr = "";
        let servicesId = [];
        this.projectsObj[project_id].forEach((item) => {
          taskDescr += `- ${item.task_description} \n`;

          if (!servicesId.includes(item.service_id)) {
            servicesId.push(service_id);
          }
        });

        this.reports[project_id] = {
          whatDid: taskDescr,
          servicesId,
        };
      });
    },

    computeDates() {
      const dateObj = this.dynamicNow ? this.dynamicNow : this.now;
      const { from, to } = getWeekTimeRange(dateObj);

      this.from = from;
      this.to = to;
    },
    previousWeek() {
      this.dynamicNow = new Date(
        this.now.getTime() + FULL_WEEK_MS * --this.timeIndex
      );
      this.computeDates();
      this.loadProjectsForPeriod();
    },
    nextWeek() {
      this.dynamicNow = new Date(
        this.now.getTime() + FULL_WEEK_MS * ++this.timeIndex
      );
      this.computeDates();
      this.loadProjectsForPeriod();
    },

    loadProjectsForPeriod() {
      this.projectsObj = {};
      const tasks = this.findTasksInRange();

      tasks.forEach((task) => {
        const { project_id } = task;
        if (!this.projectsObj[project_id]) {
          this.projectsObj[project_id] = [];
        }
        this.projectsObj[project_id].push(task);
      });
    },

    findTasksInRange() {
      const taskStore = useTaskStore();
      return taskStore.tasks.filter((item) => {
        if (!item.completed_date) return false;

        const taskTime = new Date(item.completed_date);
        return isInRange(taskTime.getTime(), this.from, this.to);
      });
    },
  },
});
