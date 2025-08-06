<script>
export default {
}
</script>

<template>
    <div class="tasks">
      <p class="title-secondary">Список задач:</p>
      <div class="tasks__list">

        <div class="task">
          <p class="task__description">
            Описание задачи, что сделал тут скорее всего не будет много текста
          </p>

          <div class = "task__extra">
            <p class="task__project">проект задачи</p>
            <p class="task__time">12.07.2025 (2 дн назад)</p>  
          </div>

          <div class="task__actions">
            <button class="btn btn-accent task__edit">Edit</button>
          </div>
        </div>

        <div class="task">
          <p class="task__description">
            Описание задачи, что сделал тут скорее всего не будет много текста Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum tempora illum molestias obcaecati iure dolor ipsum vitae numquam ad saepe!
          </p>

          <div class = "task__extra">
            <p class="task__project">проект задачи</p>
            <p class="task__time">12.07.2025 (3 дн назад)</p>  
          </div>

          <div class="task__actions">
            <button class="btn btn-accent task__edit">Edit</button>
          </div>
        </div>
        <div class="task">
          <p class="task__description">
            Описание задачи, что сделал тут скорее всего не будет много текста
          </p>

          <div class = "task__extra">
            <p class="task__project">проект задачи</p>
            <p class="task__time">12.07.2025 (1 дн назад)</p>  
          </div>

          <div class="task__actions">
            <button class="btn btn-accent task__edit">Edit</button>
          </div>
        </div>

      </div>
    </div>
</template>
