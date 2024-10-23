import { createRouter, createWebHashHistory } from 'vue-router';
import comidafoto from '../views/comidafoto.vue';
import Efoto from '../views/Efoto.vue';


const routes = [
  {
    path: '/',
    name: 'comidafoto',
    component: comidafoto
  },
  {
    path: "/efoto",
    component: Efoto
  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
