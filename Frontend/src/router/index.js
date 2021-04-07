import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import AddPost from '../views/AddPost.vue'
import AddPostArticle from '../views/AddPostArticle.vue'
import AddPostImage from '../views/AddPostImage.vue'
import Profil from '../views/Profil.vue'
import ProfilInfos from '../views/ProfilInfos.vue'
import ProfilSecurity from '../views/ProfilSecurity.vue'
import Admin from '../views/Admin.vue'
import AdminComments from '../views/AdminComments.vue'
import AdminUsers from '../views/AdminUsers.vue'
import Post from '../views/Post.vue'
import store from '@/store'

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
    component: Profil,
    children: [
      {
        path: 'infos',
        name: 'Infos',
        component: ProfilInfos
      },
      {
        path: 'securite',
        name: 'Security',
        component: ProfilSecurity
      }
    ]
  },{
    path: '/add',
    name: 'Add',
    component: AddPost,
    children: [
      {
        path: 'article',
        name: 'Article',
        component: AddPostArticle
      },
      {
        path: 'image',
        name: 'Image',
        component: AddPostImage
      }
    ]
  }, {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if(store.state.current_user.isAdmin === 1) { return next(); }
      return next('/');
    },
    children: [
      {
        path: 'comments',
        name: 'Comments',
        component: AdminComments
      },
      {
        path: 'users',
        name: 'Users',
        component: AdminUsers
      }
    ]
  }, {
    path: '/post/:id',
    name: 'Post',
    component: Post,
    params: true,
  }
  // , {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name === "Login" && localStorage.getItem('token') !== null) { return next('/');}
  if(to.name === "Login" || localStorage.getItem('token') !== null) { return next(); }

  return next('/login');
})

export default router
