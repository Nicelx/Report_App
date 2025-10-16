<script>
import { mapStores } from "pinia";

import { useTaskStore, useControlsStore, useReportStore } from "@/stores";

export default {
  data() {
    return {
      isVisible: true,
      selectedService: "",
    };
  },
  props: {
    projectId: "",
  },
  methods: {
    firstChangeHandler() {
      this.reportStore.touch();
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    addService() {
      if (this.selectedService == "") {
        return;
      }
      this.reportStore.reports[this.projectId].service_id_array.push(
        this.selectedService
      );
      this.selectedService = "";
    },
    clearServices() {
      this.reportStore.reports[this.projectId].service_id_array = [];
    },
  },

  computed: {
    ...mapStores(useTaskStore, useControlsStore, useReportStore),
    currentReport() {
      return this.reportStore.reports[this.projectId] || {};
    },
    services() {
      return this.reportStore.reports[this.projectId].service_id_array;
    },
    notAddedServices() {
      const filtered = this.taskStore.filteredServices.filter((item) => {
        if (this.services.includes(item.id)) return false;
        return true;
      });

      return filtered;
    },

    visible() {
      if (!this.isVisible) {
        return "Расркыть";
      } else {
        return "Скрыть";
      }
    },
  },
  // mounted() {},
};
</script>

<template>
  <button @click="toggleVisibility" class="btn btn-outline m2">
    Проект: {{ this.taskStore.projectMap[this.projectId] }}
    {{ this.visible }}
  </button>
  <div v-if="isVisible">
    <p class="m1"><span class="red">*</span>Услуги, по которым были работы:</p>
    <ul class="m2">
      <li v-for="service in services">
        - {{ this.taskStore.servicesMap[service] }}
      </li>
    </ul>
    <div class="row m2">
      <!-- servicesMap -->
      <select class="select m1" v-model="this.selectedService">
        <option disabled value="">Choose service</option>
        <option
          v-for="service in notAddedServices"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
      </select>
      <button class="btn btn-primary m1" @click="addService">
        Добавить услугу
      </button>
      <button class="btn btn-secondary m1" @click="clearServices">
        Очистить
      </button>
    </div>
    <p class="m1"><span class="red">*</span>Что сделали:</p>
    <!-- v-model="this.reportStore.reports[this.projectId].report_description" -->
    <textarea
      class="input m2"
      v-model="currentReport.report_description"
      @input="firstChangeHandler"
      placeholder="task description"
      rows="5"
    ></textarea>

    <p class="m1">Что получили:</p>
    <textarea
      class="input m2"
      v-model="currentReport.what_get"
      @input="firstChangeHandler"
      rows="5"
    ></textarea>

    <p class="m1">Выводы:</p>
    <textarea
      class="input m2"
      v-model="currentReport.conclusions"
      @input="firstChangeHandler"
      rows="5"
    ></textarea>

    <p class="m1">Ссылки на файлы:</p>
    <textarea
      class="input m2"
      v-model="currentReport.links"
      @input="firstChangeHandler"
      rows="5"
    ></textarea>

    <p class="m1">Планы:</p>
    <textarea
      class="input m2"
      v-model="currentReport.plans"
      @input="firstChangeHandler"
      rows="5"
    ></textarea>

    <p class="m1">
      <span class="red">*</span>Как вы оцениваете результаты работы по проекту
      за прошедшую неделю?:
    </p>
    <select
      class="select m1"
      v-model="currentReport.how_good_are_you"
      @change="handleFirstChange"
    >
      <option disabled value="">Оценка</option>
      <option value="excellent">Отлично</option>
      <option value="good">Хорошо</option>
      <option value="bad">Плохо</option>
    </select>

    <p class="m1">Зависшие моменты:</p>
    <textarea
      class="input m2"
      v-model="currentReport.hanging"
      rows="5"
    ></textarea>
  </div>
</template>
