import Api from "@/service/api";
import Vue from "vue";
import currentPage from "@/utils/paginateHelper";

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
        UPDATE_POST(state, updatePost) {
            state.posts.forEach(post => {
                if(post.id === updatePost.id) {
                    post.title = updatePost.title;
                    post.content = updatePost.content;
                }
            });
        },
        DELETE_POST(state, post_id) {
          state.posts = state.posts.filter(post => post.id !== post_id);
        },
        DELETE_POSTS(state) {
            state.posts = [];
        },
        CREATE_POST(state, post) {
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
        TOGGLE_COMMENTS(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    Vue.set(post, 'showComment', data.state !== undefined ? data.state : !post.showComment);
                }
            });
        },
        TOGGLE_TEXTAREA(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    Vue.set(post, 'showTextarea', data.state !== undefined ? data.state : !post.showTextarea );
                }
            });
        },
    },
    actions: {
        async loadPosts({ commit }, options) {
            const type = options.type !== undefined ? '/' + options.type : '';
            const res = await Api().get('/posts' + type + currentPage(options.page !== undefined ? options.page : undefined));

            if(res.status === 200) {
                const comments = res.data.rows.map(post => { return { post_id: post.id, comments: post.Comments }});

                commit('SET_POSTS', res.data.rows);
                commit('comments/SET_COMMENTS', comments, { root: true })
                commit('paginate/SET_PAGINATE', {model: 'posts', params: res.data.paginate}, { root: true })
            }
        },
        async loadUserPost({ commit }, slug) {
            const res = await Api().get('/profil/' + slug);
            if(res.status === 200) {
                const comments = res.data.user.Posts.map(post => { return { post_id: post.id, comments: post.Comments }});

                commit('SET_POSTS', res.data.user.Posts);
                commit('comments/SET_COMMENTS', comments, { root: true });

                delete res.data.user.Posts;
                commit('SET_USER', res.data.user, { root: true });
            }
        },
        async loadPost({ commit }, post_id) {
            const res = await Api().get('/posts/' + post_id );

            if(res.status === 200) {
                commit('SET_POST', res.data);
            }
            return res;
        },
        async createPost({commit}, formData) {
            const res = await Api().post('/posts', formData );
            if(res.status === 200) {
                commit('CREATE_POST', res.data.data);
            }

            return res;
        },
        async updateArticle({commit}, data) {
            const res = await Api().put('/posts/' + data.id, data.formData).catch((err) => err.response);
            if(res.status === 200) {
                commit('UPDATE_POST', data);
            }

            return res;
        },
        async updateImage({commit}, post) {
            const res = await Api().put('/posts/' + post.id, { content: post.content}).catch((err) => err.response);
            if(res.status === 200) {
                commit('UPDATE_POST', post);
            }

            return res;
        },
        async deletePost({commit}, post_id) {
            const res = await Api().delete('/posts/' + post_id).catch((err) => err.response);

            if(res.status === 200) {
                commit('DELETE_POST', post_id);
            }

            return res;
        },
        deletePosts({ commit }) {
          commit('DELETE_POSTS');
          commit('paginate/DELETE_PAGINATE_POSTS', {}, { root: true });
        },
        async likePost({ commit }, data) {
            const res = await Api().post('/posts/' + data.post_id + '/like', {like : data.like}).catch((err) => err.response);
            if(res.status === 200 || res.status === 201) {
                commit('SET_POST_LIKE', {post_id: data.post_id, likes: res.data.likes})
                commit('SET_CURRENT_USER_LIKE', {post_id: data.post_id, like : data.like}, { root: true })
            }
        },
        toggleComments({ commit }, post_id) {
            commit('TOGGLE_COMMENTS', post_id);
        },
        toggleTextarea({ commit }, data) {
            commit('TOGGLE_TEXTAREA', data);
        },
    }
}
