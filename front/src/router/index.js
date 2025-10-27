import Settings from "../views/Settings.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Report from "@/views/Report.vue";
import Projects from "@/views/Projects.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, hideWhenAuth: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = !!localStorage.getItem('authToken');

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuth) {
    next({
      path: "/login",
    });
  } else if (to.matched.some((record) => record.meta.hideWhenAuth) && isAuth) {
    next("/");
  } else {
    next();
  }
});

export default router;
