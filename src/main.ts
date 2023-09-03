import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory } from "vue-router";

import App from "./App.vue";

import Tip from "./components/Tip";
import Loading from "./components/Loading";

import Manager from "./Manager.vue";
import Work from "./Work.vue";

const routes = [
  { name: "manager", path: "/", component: Manager },
  { name: "work", path: "/work", component: Work },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App)
  .use(router)
  .use(createPinia())
  .use(Tip)
  .use(Loading)
  .mount("#app");
