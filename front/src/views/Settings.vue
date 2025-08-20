<script>

import { mapStores } from "pinia";

export default {
  data() {
    return {
      // inputDate: new Date().toISOString().slice(0, 10),
    };
  },
  methods: {
    
  },
  
};
</script>

<template>
  <div style="width: 400px">
    <button class="btn btn-primary btn-md">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-accent">Accent</button>
    <button class="btn btn-outline">Outline</button>
  </div>

  <!-- <p>{{ this.exampleStore.counter }}</p> -->
  <button>+1</button>

  <input
    class="input m1"
    v-model="inputDate"
    type="date"
    value="formattedDate"
  />

  <p>
    {{ formattedDate }}
  </p>
</template>


<!-- <div class="message message--success">Успех!</div>
    <div class="message message--success">Задача успешно создана</div>

    <div class="message message--error">Ошибка</div> -->