<script>
import { mapStores } from "pinia";

import { useTaskStore, useControlsStore } from "@/stores";

export default {
  data() {
    return {
      projectFilter: 0,
    };
  },
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [], // Значение по умолчанию - пустой массив
    },
    projects: {
      type: Array,
      required: true,
      default: () => [], // Значение по умолчанию - пустой массив
    },
  },
  methods: {
    formatDate(dateStr) {
      const utcDate = new Date(dateStr);
      const ruDate = utcDate.toLocaleDateString("ru-RU");
      return ruDate;
    },
    edit(id) {
      this.controlsStore.editOpen(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  computed: {
    ...mapStores(useControlsStore, useTaskStore),
    sortedTasks() {
      return [...this.tasks].sort((a, b) => {
        return new Date(b.completed_date) - new Date(a.completed_date);
      });
    },
    filteredTasks() {
      // console.log('pf', this.projectFilter);
      if (this.projectFilter == 0) return this.sortedTasks;
      return [...this.sortedTasks].filter(item => {
        return item.project_id == this.projectFilter;
      })
    },
  },
};
</script>

<template>
  <div class="tasks">
    <p class="title-secondary">Список выполненных задач:</p>
    <select class="select m2" v-model="this.projectFilter">
      <option value="0">Все проекты</option>
      <option
        v-for="project in this.taskStore.projects"
        :key="project.id"
        :value="project.id"
      >
        {{ project.name }}
      </option>
    </select>


    <div class="tasks__list">
      <div v-for="task in filteredTasks" :key="task.id" class="task">
        <p class="task__description">
          {{ task.task_description }}
        </p>

        <div class="task__extra">
          <p class="task__project" @click="this.projectFilter = task.project_id">
            {{ this.taskStore.projectMap[task.project_id] }}
          </p>
          <p class="task__time">{{ formatDate(task.completed_date) }}</p>
        </div>

        <div class="task__actions">
          <button @click="edit(task.id)" class="btn btn-accent task__edit">
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>