import Vue from 'vue'
import Vuex from 'vuex'
import adminModule from  './adminStore';
import authModule from  './authStore';
import commentsModule from  './commentsStore';
import paginateModule from './paginateStore';
import postsModule from  './postsStore';
import searchModule from "./searchStore";
import snackbarModule from './snackbarStore';
import userModule from  './userStore';

Vue.use(Vuex);
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    admin: adminModule,
    auth: authModule,
    comments: commentsModule,
    paginate: paginateModule,
    posts: postsModule,
    search: searchModule,
    snackbar: snackbarModule,
    user: userModule
  }
})
