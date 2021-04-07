import Api from "@/service/api";
import Vue from "vue";

export default {
    namespaced: true,
    state : {
        posts: []
    },
    mutations : {
        SET_POSTS(state, posts) {
            state.posts = posts;
        },
        SET_POST(state, post) {
            state.posts.push(post);
        },
        SET_POST_LIKE(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    post.like = data.likes.like;
                    post.dislike = data.likes.dislike;
                }
            });
        },
        TOGGLE_COMMENTS(state, post_id) {
            state.posts.forEach(post => {
                if(post.id === post_id) {
                    Vue.set(post, 'showComment', !post.showComment);
                }
            });
        },
    },
    actions: {
        async loadPosts({ commit }) {
            const res = await Api().get('/posts');
            const comments = res.data.map(post => { return { post_id: post.id, comments: post.Comments }});

            if(res.status === 200) {
                commit('SET_POSTS', res.data);
                commit('comments/SET_COMMENTS', comments, { root: true })
            }
        },
        async loadPost({ commit }, post_id) {
            const res = await Api().get('/posts/' + post_id );
            if(res.status === 200) {
                commit('SET_POST', res.data);
            }
        },
        async createPost({commit}, formData) {
            console.log(formData);
            const res = await Api().post('/posts', formData );
            if(res.status === 200) {
                commit('CREATE_POST', res.data.data);
            }

            return res;
        },
        async likePost({ commit }, data) {
            const res = await Api().post('/posts/' + data.post_id + '/like', {like : data.like}).catch(err => console.log(err));

            if(res.status === 200 || res.status === 201) {
                commit('SET_POST_LIKE', {post_id: data.post_id, likes: res.data.likes})
                commit('SET_CURRENT_USER_LIKE', {post_id: data.post_id, like : data.like}, { root: true })
            }
        },
        toggleComments({ commit }, post_id) {
            commit('TOGGLE_COMMENTS', post_id);
        },
    }
}
