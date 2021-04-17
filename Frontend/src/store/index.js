import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/service/api';
import adminModule from  './adminStore';
import commentsModule from  './commentsStore';
import postsModule from  './postsStore';
import snackbarModule from './snackbarStore';
import paginateModule from './paginateStore';

Vue.use(Vuex);
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    comments: commentsModule,
    posts: postsModule,
    snackbar: snackbarModule,
    admin: adminModule,
    paginate: paginateModule
  },
  state: {
    current_user: {},
    users: []
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    BAN_USER(state, data) {

      state.users.forEach(user => {
        if(user.id === data.user_id) {
          user.banUntil =  data.banUntil
          user.formatBanUntil = data.formatBanUntil;
          ++user.nbBan;
        }
      })
    },
    SET_CURRENT_USER(state, user) {
      state.current_user = user;
    },
    UPDATE_CURRENT_USER_PROFIL(state, user) {
      state.current_user.name = user.name;
      state.current_user.email = user.email;

      if(user.avatar !== undefined) {
        state.current_user.avatar = user.avatar;
        state.current_user.avatarPath = user.avatarPath;
      }
    },
    SET_CURRENT_USER_LIKE(state, data) {
      if(data.like === 0) {
        return state.current_user.likes = state.current_user.likes.filter(like => like.PostId !== data.post_id);
      }

      if(state.current_user.likes.find(like => like.PostId === data.post_id) === undefined) {
        return state.current_user.likes.push({PostId : data.post_id, like : data.like});
      }

      state.current_user.likes.forEach(like => {
        if(like.PostId === data.post_id) {
          like.like = data.like;
        }
      });
    },
    DELETE_CURRENT_USER(state) {
      state.current_user = {}
    },
  },
  getters: {
    getCurrentUser: state => { return state.current_user}
  },
  actions: {
    async loadUsers({ commit }) {
      const res = await Api().get('/admin/users').catch(err => err.response);
      if(res.status === 200) {
        commit('SET_USERS', res.data);
      }
    },
    async banUser({ commit }, user_id) {
      const res = await Api().put('/admin/users/' + user_id + '/ban', {UserId: user_id, message: 'utilisateur banni.'}).catch(err => err.response);
      if(res.status === 200) {
        commit('BAN_USER', {user_id: user_id, banUntil : res.data.banUntil, formatBanUntil : res.data.formatBanUntil})
      }
      return res;
    },
    async userLogin({commit}, loginData) {
      const res = await Api().post('/auth/login', loginData).catch((err) => err.response);

      if(res.status === 200) {
        commit('SET_CURRENT_USER', res.data.user);
        localStorage.setItem('token', res.data.user.token);
      }

      return res;
    },
    async userRegister({commit}, loginData) {
      const res = await Api().post('/auth/signup', loginData).catch((err) => err.response);

      if(res.status === 201) {
        commit('SET_CURRENT_USER', res.data.user);
        localStorage.setItem('token', res.data.user.token);
      }

      return res;
    },
    async updateProfil({commit, state}, formData) {
      const res = await Api().put('/profil/' + state.current_user.id , formData).catch(err => err.response);

      if(res.status === 200) {
        commit('UPDATE_CURRENT_USER_PROFIL', res.data.data);
      }

      return res;
    },
    async deleteProfil({commit}, user_id) {
      const res = await Api().delete('/profil/' + user_id).catch(err => err.response);

      if(res.status === 200) {
        commit('DELETE_CURRENT_USER');
        localStorage.removeItem('token');
      }

      return res;
    },
    async updatePassword({state}, passData) {
      return await Api().put('/profil/' + state.current_user.id + '/password', passData).catch(err => err.response);
    },
    logout({ commit }) {
      commit('DELETE_CURRENT_USER');
      localStorage.removeItem('token');
    },
    async getCurrentUser({ commit }) {
      const res = await Api().get('/auth/current_user').catch(() => false);

      if(res.status === 200) {
        commit('SET_CURRENT_USER', res.data);
      }

      return res;
    }
  },
})
