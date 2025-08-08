<script>
export default {
  data() {
    return {
      inputDate: new Date().toISOString().slice(0, 10),
    };
  },
  methods: {
    getCurrentDateTime() {
      const now = new Date();

      now.setSeconds(0, 0);

      return now.toISOString().slice(0, 16);
    },
  },
  computed: {
    formattedDate() {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const datetimeValue = `${this.inputDate} ${hours}:${minutes}:00`;
      
      return datetimeValue;
    },
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
