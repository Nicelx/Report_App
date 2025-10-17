import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { fetchWithAuth } from "@/utils/api";

const FULL_WEEK_MS = 604800000;

export const useReportStore = defineStore("report", {
  state: () => ({
    report: {},
    tasksInRange: [],
    projectsInRange: [], //ids here
    isTouched: false,
    isDataValid: false,
    now: new Date(),
    dynamicNow: "",
    from: "",
    to: "",
    timeIndex: 0,
    statusMessage: "",
    loadedReports: [],
  }),

  actions: {
    async sendReport() {
      // validation block
      // this.validateReports();
      // if (!this.isDataValid) {
      //   return;
      // }
      this.validateReport();

      const response = await fetchWithAuth(
        "http://localhost:3000/add-report111",
        {
          method: "POST",
          body: JSON.stringify({
            report: this.report,
            start_date: this.from,
            end_date: this.to,
          }),
        }
      );

      // await this.updateTasks();
    },

    validateReport() {
      if (!this.from || !this.to) {
        this.statusMessage = "Ошибка периода";
        this.isDataValid = false;
        return;
      }

      this.isDataValid = true;
    },
    // !!!!!!!!!!!!!!
    // REWRITE !!!
    // validateReports() {
    //   console.log(this.from, this.to);

    //   if (!this.from || !this.to) {
    //     this.$tatusMessage = "Ошибка периода";
    //     this.isDataValid = false;
    //     return;
    //   }

    //   for (const key in this.reports) {
    //     const reportObj = this.reports[key];

    //     if (!reportObj.how_good_are_you) {
    //       this.isDataValid = false;
    //       this.statusMessage = "Не указана оценка";
    //       return;
    //     }
    //     if (reportObj.report_description.length <= 0) {
    //       this.isDataValid = false;
    //       this.statusMessage = 'Не заполнено обязательное поле "что сделали"';
    //       return;
    //     }
    //     if (reportObj.service_id_array.length <= 0) {
    //       this.isDataValid = false;
    //       this.statusMessage = "Не указаны услуги";
    //       return;
    //     }

    //     console.log(
    //       typeof reportObj.report_description.length,
    //       "report description"
    //     );
    //   }

    //   this.statusMessage = "validation succesful";
    //   this.isDataValid = true;
    // },

    fillReport(projectId) {
      const tasksForProject = this.tasksInRange.filter(
        (task) => task.project_id == projectId
      );

      let buildedDescr = "";
      tasksForProject.forEach((task) => {
        buildedDescr += `- ${task.task_description} \n`;
      });

      let services_array = [
        ...new Set(tasksForProject.map((item) => item.service_id)),
      ];

      this.report = {
        projectId: projectId || null,
        report_description: buildedDescr,
        service_id_array: services_array,
        how_good_are_you: "",
        what_get: "",
        conclusions: "",
        links: "",
        plans: "",
        hanging: "",
      };
    },

    computeDates() {
      const dateObj = this.dynamicNow ? this.dynamicNow : this.now;
      const { from, to } = getWeekTimeRange(dateObj);

      this.from = from;
      this.to = to;
    },
    previousWeek() {
      this.timeIndex--;
      this.changeWeekHandler();
    },
    nextWeek() {
      this.timeIndex++;
      this.changeWeekHandler();
    },
    changeWeekHandler() {
      this.dynamicNow = new Date(
        this.now.getTime() + FULL_WEEK_MS * this.timeIndex
      );
      this.computeDates();
      this.findTasksInRange();
    },

    findTasksInRange() {
      const taskStore = useTaskStore();
      this.tasksInRange = taskStore.tasks.filter((item) => {
        if (!item.completed_date) return false;

        const taskTime = new Date(item.completed_date);
        const findedTasks = isInRange(taskTime.getTime(), this.from, this.to);

        return findedTasks;
      });
      console.log("findTasksInRange triggered");
      this.projectsInRange = [
        ...new Set(this.tasksInRange.map((item) => item.project_id)),
      ];
    },
    touch() {
      this.isTouched = true;
    },

    async getReports(filter) {
      const token = localStorage.getItem("authToken");
      let url = "http://localhost:3000/reports/";
      let queryStr = `?`;

      for (let key in filter) {
        queryStr += `${key}=${filter[key]}&`;
      }

      if (queryStr.length > 1) {
        url += queryStr.slice(0, -1);
      }

      const response = await fetchWithAuth(url, {
        method: "GET",
      });

      const data = await response.json();
      this.loadedReports = [...data.result];
    },
  },
});
