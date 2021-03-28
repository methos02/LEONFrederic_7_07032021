import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/service/api';

Vue.use(Vuex);
Vue.config.devtools = true

export default new Vuex.Store({
  state: {
    current_user: {},
    posts: {}
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.current_user = user;
    },
    DELETE_CURRENT_USER(state) {
      state.current_user = {}
    },
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_POST(state, post) {
      state.posts.push(post);
    },
    SET_POST_LIKE(state, data) {
      state.posts.forEach(post => {
        if(post.id === data.id) {
          post.like = data.likes.like;
          post.dislike = data.likes.dislike;
        }
      });
    }
  },
  getters: {
    getCurrentUser: state => { return state.current_user}
  },
  actions: {
    async userLogin({ commit }, loginData) {
      const res = await Api().post('/auth/login', loginData).catch((err) => err.response);

      if(res !== undefined) {
        commit('SET_CURRENT_USER', res.data.user);
        window.localStorage.current_user = res.data.user;
      }

      return res;
    },
    logout({ commit }) {
      commit('DELETE_CURRENT_USER');
      delete window.localStorage.current_user;
    },
    async loadPosts({ commit }) {
      const res = await Api().get('/posts', { data: { UserId: this.state.current_user.id } });
      commit('SET_POSTS', res.data);
    },
    async loadPost({ commit }, id) {
      if(!this.state.posts.find(post => post.id === id)) {
        const res = await Api().get('/posts/' + id );
        commit('SET_POST', res.data);
      }
    },
    async likePost({ commit }, data) {
      const res = await Api().post('/posts/' + data.id + '/like', { like : data.like});
      commit('SET_POST_LIKE', {id: data.id, likes: res.data.likes})
    }
  },
  modules: {
  }
})
