<script>
export default {
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
      // return dateStr;
    },
  },
  computed: {
    projectMap() {
      const map = {};
      this.projects.forEach((project) => {
        map[project.id] = project.name;
      });
      return map;
    },
    sortedTasks() {
      return [...this.tasks].sort((a, b) => {
        return new Date(b.completed_date) - new Date(a.completed_date);
      });
    },
  },
};
</script>

<template>
  <div class="tasks">
    <p class="title-secondary">Список выполненных задач:</p>
    <div class="tasks__list">
      
      <div v-for="task in sortedTasks" :key="task.id" class="task">
        <p class="task__description">
          {{ task.task_description }}
        </p>

        <div class="task__extra">
          <p class="task__project">{{ projectMap[task.project_id] }}</p>
          <p class="task__time">{{ formatDate(task.completed_date) }}</p>
        </div>

        <div class="task__actions">
          <button class="btn btn-accent task__edit">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>
