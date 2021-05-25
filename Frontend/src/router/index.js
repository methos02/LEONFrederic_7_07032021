import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import AddPostArticle from '../views/AddPostArticle.vue'
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
    meta: {
      title: 'Groupomania'
    },
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
    meta: {
      title: 'Connexion - Groupomania'
    },
  },
  {
    path: '/article/:id',
    name: 'UpdateArticle',
    component: UpdatePostArticle,
    params: true,
    meta: {
      title: 'Mise à jour article - Groupomania'
    },
  },{
    path: '/profil',
    name: 'Profil',
    component: Profil,
    children: [
      {
        path: 'infos',
        name: 'Infos',
        component: ProfilInfos,
        meta: {
          title: 'Profil - Groupomania'
        },
      },
      {
        path: 'securite',
        name: 'Security',
        component: ProfilSecurity,
        meta: {
          title: 'Profil - Groupomania'
        },
      }
    ]
  },{
    path: '/add-article',
    name: 'AddArticle',
    component: AddPostArticle,
    meta: {
      title: 'Ajout Article - Groupomania'
    }
  }, {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if(store.state.auth.current_user.roles !== undefined && store.state.auth.current_user.roles.find(role => role === 'modo')) { return next(); }
      return next('/');
    },
    children: [
      {
        path: 'comments',
        name: 'Comments',
        component: AdminComments,
        meta: {
          title: 'Administration Commentaires - Groupomania'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: AdminUsers,
        meta: {
          title: 'Administration Utilisateurs - Groupomania'
        }
      }
    ]
  }, {
    path: '/post/:slug',
    name: 'Post',
    component: Post,
    params: true,
    meta: {
      title: 'Articles - Groupomania'
    }
  }, {
    path: '/user/:slug',
    name: 'User',
    component: User,
    params: true,
    meta: {
      title: 'Profil - Groupomania'
    },
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
  document.title = to.meta.title || 'Your Website';
  if(["Auth"].indexOf(to.name) !== -1 && localStorage.getItem('token') !== null) { return next('/');}
  if(["Auth"].indexOf(to.name) !== -1 || localStorage.getItem('token') !== null) { return next(); }

  return next('/login');
})

export default router
