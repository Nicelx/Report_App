<script>
export default {
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [], // Значение по умолчанию - пустой массив
    },
  },
};
</script>

<template>
  <div class="tasks">
    <p class="title-secondary">Список задач:</p>
    <div class="tasks__list">
      <div v-for="task in tasks" :key="task.id" class="task">
        <p class="task__description">
          {{ task.task_description }}
        </p>

        <div class="task__extra">
          <!-- <p class="task__project">{{ getProject Name(task.project_id) }}</p> -->
          <p class="task__project">{{ task.project_id }}</p>
          <p class="task__time">{{ task.completed_date }}</p>
        </div>

        <div class="task__actions">
          <button class="btn btn-accent task__edit">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>
