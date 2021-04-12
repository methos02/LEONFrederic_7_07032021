import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AddPost from '../views/AddPost.vue'
import AddPostArticle from '../views/AddPostArticle.vue'
import AddPostImage from '../views/AddPostImage.vue'
import UpdatePost from '../views/UpdatePost.vue'
import UpdatePostArticle from '../views/UpdatePostArticle.vue'
import UpdatePostImage from '../views/UpdatePostImage.vue'
import DeletePost from '../views/DeletePost.vue'
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
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },{
    path: '/update',
    name: 'Update',
    component: UpdatePost,
    params: true,
    children: [
      {
        path: 'article/:id',
        name: 'UpdateArticle',
        component: UpdatePostArticle
      },
      {
        path: 'image/:id',
        name: 'UpdateImage',
        component: UpdatePostImage
      }
    ]
  },{
    path: '/delete/:id',
    name: 'DeletePost',
    component: DeletePost,
    params: true,
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
        name: 'AddArticle',
        component: AddPostArticle
      },
      {
        path: 'image',
        name: 'AddImage',
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
  if(["Login", "Register"].indexOf(to.name) !== -1 && localStorage.getItem('token') !== null) { return next('/');}
  if(["Login", "Register"].indexOf(to.name) !== -1 || localStorage.getItem('token') !== null) { return next(); }

  return next('/login');
})

export default router
