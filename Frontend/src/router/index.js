import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import AddPost from '../views/AddPost.vue'
import AddPostArticle from '../views/AddPostArticle.vue'
import AddPostImage from '../views/AddPostImage.vue'
import UpdatePostArticle from '../views/UpdatePostArticle.vue'
import Profil from '../views/Profil.vue'
import ProfilInfos from '../views/ProfilInfos.vue'
import ProfilSecurity from '../views/ProfilSecurity.vue'
import Admin from '../views/Admin.vue'
import AdminComments from '../views/AdminComments.vue'
import AdminUsers from '../views/AdminUsers.vue'
import Post from '../views/Post.vue'
import User from '../views/User.vue'
import store from '@/store'

Vue.use(VueRouter)
const routes = [
  {
    path: '/:type(images|articles)*',
    name: 'Home',
    component: Home,
    params: true,
    beforeEnter: (to, from, next) => {
      store.dispatch('posts/deletePosts');
      return next();
    },
},
  {
    path: '/:page(login|register)*',
    name: 'Auth',
    component: Auth,
    params: true,
  },
  {
    path: '/article/:id',
    name: 'UpdateArticle',
    component: UpdatePostArticle,
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
  }, {
    path: '/user/:slug',
    name: 'User',
    component: User,
    params: true,
    beforeEnter: (to, from, next) => {
      store.dispatch('posts/deletePosts');
      return next();
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(["Auth"].indexOf(to.name) !== -1 && localStorage.getItem('token') !== null) { return next('/');}
  if(["Auth"].indexOf(to.name) !== -1 || localStorage.getItem('token') !== null) { return next(); }

  return next('/login');
})

export default router
