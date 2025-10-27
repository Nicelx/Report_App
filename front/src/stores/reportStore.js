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
    isDataValid: false,
    now: new Date(),
    dynamicNow: "",
    from: "",
    to: "",
    timeIndex: 0,
    statusMessage: "",
    loadedReports: [],
    editMode: "add", // add, edit
  }),

  actions: {
    async sendReport() {
      this.validateReport();

      if (!this.isDataValid) return;

      const response = await fetchWithAuth("http://localhost:3000/add-report", {
        method: "POST",
        body: JSON.stringify({
          report: this.report,
          start_date: this.from,
          end_date: this.to,
        }),
      });

      if (response.status == 200) {
        this.statusMessage = "Отчёт отправлен";

        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
        }, 2000);

        this.resetReport();
      }
    },

    async updateReport() {
      const { id } = this.report;

      this.validateReport();

      if (!this.isDataValid) return;

      if (!id) {
        this.statusMessage = "Не передан id отчёта для обновления";
        return;
      }

      const response = await fetchWithAuth(
        `http://localhost:3000/update-report/${this.report.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            report: this.report,
            start_date: this.from,
            end_date: this.to,
          }),
        }
      );

      if (response.status == 200) {
        this.statusMessage = "Отчёт отправлен";

        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
        }, 2000);

        this.resetReport();
        this.setAdd();
      }
      if (response.status == 500) {
        console.log(response.json().message);

        this.statusMessage = response.json().message;
        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
        }, 2000);
      }
    },

    async deleteReport() {
      const { id } = this.report;

      if (!id) {
        this.statusMessage = "Не передан id отчёта для обновления";
        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
        }, 2000);
        return;
      }

      const response = await fetchWithAuth(
        `http://localhost:3000/delete-report/${this.report.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status == 200) {
        this.setAdd();
        this.statusMessage = "Отчёт удалён=(";

        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
          this.$router.push("/projects");
        }, 2000);
      }
      if (response.status == 500) {
        const data = await response.json(); 
        this.statusMessage = data.message;

        setTimeout(() => {
          this.statusMessage = "";
          this.isDataValid = false;
        }, 2000);
      }
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

    setEdit() {
      this.editMode = "edit";
    },

    setAdd() {
      this.editMode = "add";
    },

    resetReport() {
      this.report = {
        report_description: "",
        hanging: "",
        conclusions: "",
        how_good_are_you: "",
        links: "",
        plans: "",
        service_id_array: [],
        what_get: "",
      };
    },

    validateReport() {
      const { how_good_are_you, report_description, service_id_array } =
        this.report;
      if (!this.from || !this.to) {
        this.statusMessage = "Ошибка периода";
        this.isDataValid = false;
        return;
      }

      if (
        !(
          how_good_are_you === "good" ||
          how_good_are_you === "bad" ||
          how_good_are_you === "excellent"
        )
      ) {
        this.isDataValid = false;
        this.statusMessage = "Не указана оценка";
        return;
      }

      if (report_description.length <= 2) {
        this.statusMessage = "Поле Что сделали не заполнено";
        this.isDataValid = false;
        return;
      }

      if (
        typeof service_id_array !== "object" ||
        service_id_array.length == 0
      ) {
        this.statusMessage = "Не указаны услуги";
        this.isDataValid = false;
        return;
      }

      this.isDataValid = true;
    },

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

      this.projectsInRange = [
        ...new Set(this.tasksInRange.map((item) => item.project_id)),
      ];
    },
  },
});
