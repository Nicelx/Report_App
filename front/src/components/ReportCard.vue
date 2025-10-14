<script>
import { mapStores } from "pinia";
import { backDateToHuman } from "@/utils/util";
import { useTaskStore, useUsersStore } from "@/stores";
// console.log(backDateToHuman);

export default {
  data() {
    return {
      grageMap: {
        excellent: "Отлично",
        good: "Хорошо",
        bad: "Плохо",
      },
    };
  },
  props: {
    reportData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    backDateToHuman,
  },
  computed: {
    ...mapStores(useTaskStore,
      useUsersStore
    ),
    services() {
      let str = '';
      const serviceArray = this.reportData.service_ids.split(',');

      serviceArray.forEach(id => {
        str += `-${this.taskStore.servicesMap[id]} \n`;
      });
      return str;
    }
  },
  // mounted() {},
};
</script>

<template>
  <div class="report-card m2">
    <h2 class="task__time m1">
      Пользователь {{this.usersStore.getUser(this.reportData.user_id).username }}<br />
      {{ backDateToHuman(this.reportData.start_date) }} до
      {{ backDateToHuman(this.reportData.end_date) }}
    </h2>

    <p class="task__time">Что сделано:</p>
    <p class="m2">{{ this.reportData.report_description }}</p>

    <div v-if="this.reportData.what_get">
      <p class="task__time">Получили:</p>
      <p class="m2">{{ this.reportData.what_get }}</p>
    </div>

    <div v-if="this.reportData.conclusions">
      <p class="task__time">Выводы:</p>
      <p class="m2">{{ this.reportData.conclusions }}</p>
    </div>

    <div v-if="this.reportData.links">
      <p class="task__time">Ссылки:</p>
      <p class="m2">{{ this.reportData.links }}</p>
    </div>

    <div v-if="this.reportData.plans">
      <p class="task__time">Планы:</p>
      <p class="m2">{{ this.reportData.plans }}</p>
    </div>

    <p class="task__time">Оценка работы: </p>
    <p class="m2">{{ this.grageMap[this.reportData.how_good_are_you] }}</p>

    <div v-if="this.reportData.hanging">
      <p class="task__time">Зависшие моменты:</p>
      <p class="m2">{{ this.reportData.hanging }}</p>
    </div>


      <p class="task__time">Услуги:</p>
      <p class="m2">
        {{ services }}
      </p>


    <p class="task__project">
      {{ this.taskStore.projectMap[this.reportData.project_id] }}
    </p>
  </div>
  {{ this.reportData }}
</template>
<style>
p {
  white-space: pre-line
}
.report-card {
  border: 1px solid rgba(0, 255, 149, 0.2);
  border-radius: 4px;
  padding: 20px;
}
</style>
