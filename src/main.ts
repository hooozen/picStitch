import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import Home from './Home.vue'
import Work from './Work.vue'

const routes = [
  {
    path: '/', component: App,
    redirect: '/home',
    children: [
      { path: 'home', component: Home },
      { path: 'work', component: Work },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


createApp(App).use(router).mount('#app')