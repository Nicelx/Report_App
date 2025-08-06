<script>
import Tasks from '@/components/Tasks.vue';
export default {
  // add token somewhere
  //  data() {
  //     return {
  //       username: "",
  //       password: "",
  //       message: ''
  //     };
  //   },
  components: {
    Tasks,
  },
  methods: {
    async getTasks() {
      console.log("here full list of tasks");
    },

    async addTask() {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/add-task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user_id here",
          description: "Описание такски тут",
        }),
      });
    },

    async getInfo() {
      const token = localStorage.getItem("authToken");

      console.log("token", token);

      const response = await fetch("http://localhost:3000/get-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }); // делаем GET-запрос

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      console.log(data);
    },
    async getInfo2() {
      const response = await fetch("http://localhost:3000/get-info2"); // делаем GET-запрос

      const data = await response.json(); // предполагается, что сервер возвращает JSON
      console.log(data);
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <h1 class="title m3">Your Tasks</h1>
    
    <button class="btn btn-primary" @click="getInfo">Show tasks</button>
   
    <Tasks/>
  </div>
</template>
