<script>
import { mapStores } from "pinia";

import { useTaskStore, useControlsStore, useReportStore } from "@/stores";

export default {
  data() {
    return {
      isVisible: true,
    };
  },
  props: {
    tasksArray: {
      type: Array,
      required: true,
      default: () => [], // Значение по умолчанию - пустой массив
    },
  },
  methods: {
    initFields() {
      const services = this.servicesStr();
      const whatDid = this.taskDescriptionValue();

      this.reportStore.updateReport(this.projectId, {
        services,
        whatDid,
        whatGet: "",
        conclusions: "",
        links: "",
        plans: "",
        howGoodAreYou: "",
      });
    },
    taskDescriptionValue() {
      let str = ``;
      this.tasksArray.forEach((task) => {
        str += `- ${task.task_description} \n`;
      });
      return str;
    },
    servicesStr() {
      const strArr = [];
      const servicesIds = [];
      this.tasksArray.forEach(({ service_id }) => {
        if (!servicesIds.includes(service_id)) {
          servicesIds.push(service_id);
        }
      });

      servicesIds.forEach((id) => {
        strArr.push(this.taskStore.servicesMap[id]);
      });

      return strArr;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
  },
  // watch: {
  //   // Следим за изменениями и сохраняем в хранилище
  //   reportData: {
  //     deep: true,
  //     handler(newValue) {
  //       this.reportStore.updateReport(this.projectId, newValue);
  //     },
  //   },
  // },
  computed: {
    ...mapStores(useTaskStore, useControlsStore, useReportStore),
    projectId() {
      return this.tasksArray[0]?.project_id;
    },
    reportData() {
      return this.reportStore.reports[this.projectId] || {};
    },
    visible() {
      if (!this.isVisible) {
        return "Расркыть";
      } else {
        return "Скрыть";
      }
    },
  },
  mounted() {
    this.initFields();
    console.log(this.reportStore.reports);
  },
};
</script>

<template>
  <p class="title-secondary m2">
    Проект: {{ this.taskStore.projectMap[this.tasksArray[0].project_id] }}
  </p>
  <div v-if="isVisible">
    <p class="m1"><span class="red">*</span>Услуги, по которым были работы:</p>
    <ul class="m1">
      <li v-for="service in services">- {{ service }}</li>
    </ul>
    <div class="row ь2">
      <button class="btn btn-primary m1">Добавить услугу</button>
      <button class="btn btn-secondary m1">Очистить</button>
    </div>
    <p class="m1"><span class="red">*</span>Что сделали:</p>
    <textarea
      class="input m2"
      v-model="reportData.whatDid"
      placeholder="task description"
      rows="5"
    ></textarea>

    <p class="m1">Что получили:</p>
    <textarea class="input m2" v-model="reportData.whatGet" rows="5"></textarea>

    <p class="m1">Выводы:</p>
    <textarea class="input m2" v-model="reportData.conclusions" rows="5"></textarea>

    <p class="m1">Ссылки на файлы:</p>
    <textarea class="input m2" v-model="reportData.links" rows="5"></textarea>

    <p class="m1">Планы:</p>
    <textarea class="input m2" v-model="reportData.plans" rows="5"></textarea>

    <p class="m1">
      <span class="red">*</span>Как вы оцениваете результаты работы по проекту
      за прошедшую неделю?:
    </p>
    <select class="select m1" v-model="reportData.howGoodAreYou">
      <option disabled value="">Оценка</option>
      <option value="Отлично">Отлично</option>
      <option value="Хорошо">Хорошо</option>
      <option value="Плохо">Плохо</option>
    </select>

    <p class="m1">Зависшие моменты:</p>
    <textarea class="input m2" v-model="this.plans" rows="5"></textarea>
  </div>

  <button @click="toggleVisibility" class="btn btn-primary m1">
    {{ this.visible }}
  </button>
</template>
