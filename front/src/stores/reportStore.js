import { getWeekTimeRange, isInRange } from "@/utils/util";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";

const FULL_WEEK_MS = 604800000;

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: {},
    isTouched: false,
    isDataValid: false,
    now: new Date(),
    dynamicNow: "",
    from: "",
    to: "",
    timeIndex: 0,
    projectsObj: {},
    statusMessage : '',
    loadedReports: [
    ]
  }),

  actions: {
    async sendReport() {
      const token = localStorage.getItem("authToken");
      const { id: user_id } = JSON.parse(localStorage.getItem("user"));
      
      // validation block
      this.validateReports();
      if (!this.isDataValid) {
        return 
      }

      const response = await fetch("http://localhost:3000/add-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          reports: this.reports,
          start_date: this.from,
          end_date: this.to,
        }),
      });

      // await this.updateTasks();
    },

    validateReports() {
      console.log(this.from, this.to);
      
      if (!this.from || !this.to) {
        this.$tatusMessage = 'Ошибка периода';
        this.isDataValid = false;
        return;
      }

      for (const key in this.reports) {
        const reportObj = this.reports[key];

        // TEMP COMMENT
        if (!reportObj.how_good_are_you) {
          this.isDataValid = false;
          this.statusMessage = 'Не указана оценка';
          return;
        }
        if (reportObj.report_description.length <= 0) {
          this.isDataValid = false;
          this.statusMessage = 'Не заполнено обязательное поле "что сделали"';
          return;
        }
        if (reportObj.service_id_array.length <= 0) {
          this.isDataValid = false;
          this.statusMessage = 'Не указаны услуги';
          return;
        }

        console.log(typeof reportObj.report_description.length, 'report description');
      }

      this.statusMessage = 'validation succesful'
      this.isDataValid = true;
    },

    fillReportsFromProjects() {
      this.reports = {};

      const projectIdsArray = Object.keys(this.projectsObj);
      projectIdsArray.forEach((project_id) => {
        let taskDescr = "";
        let servicesId = [];

        this.projectsObj[project_id].forEach((project) => {
          taskDescr += `- ${project.task_description} \n`;
          if (!servicesId.includes(project.service_id)) {
            servicesId.push(project.service_id);
          }
        });

        this.reports[project_id] = {
          report_description: taskDescr,
          service_id_array: servicesId,
          how_good_are_you: '',
          what_get: '',
          conclusions: '',
          links: '',
          plans: '',
          hanging: '',
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
    touch() {
      this.isTouched = true;
    },

    async getMyReports() {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/reports/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); 

      console.log(data);
      // this.projects = data.projects;
      // this.services = data.services;
      // this.tasks = data.tasks;
      // this.generateMaps()
    }
  },
});
