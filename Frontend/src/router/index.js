import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profil from '../views/profil.vue'
import Post from '../views/Post.vue'
import store from '@/store/index';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  },{
    path: '/profil',
    name: 'Profil',
    component: Profil
  }, {
    path: '/post/:id',
    name: 'Post',
    component: Post,
    params: true,
  }, {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name === "Login" || store.state.current_user.token !== undefined) { return next(); }

  return next('/login');
})

export default router
