import Api from "@/service/api";
import currentPage from "@/helpers/paginateHelper";

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
                    post.likes = data.likes.likes;
                    post.dislikes = data.likes.dislikes;
                }
            });
        },
        ADD_COMMENT(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    post.Comments = post.Comments.concat(data.comment);
                }
            });
        },
        UPDATE_COMMENT(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    post.Comments.forEach(comment => {
                        if(comment.id === data.comment_id) {
                            comment.content = data.content;
                        }
                    });
                }
            });
        },
        DELETE_COMMENT(state, data) {
            state.posts.forEach(post => {
                if(post.id === data.post_id) {
                    post.Comments = post.Comments.filter( comment => {
                            return comment.id !== data.comment_id && comment.ParentId !== data.comment_id;
                        }
                    );
                }
            });
        }
    },
    actions: {
        async loadPosts({ commit }, options) {
            const type = options.type !== undefined ? '/' + options.type : '';
            const res = await Api().get('/posts' + type + currentPage(options.page !== undefined ? options.page : undefined)).catch((err) => err.response);

            if(res.status === 200) {
                commit('SET_POSTS', res.data.rows);
                commit('paginate/SET_PAGINATE', {model: 'posts', params: res.data.paginate}, { root: true })
            }
        },
        async loadUserPost({ commit }, options) {
            const res = await Api().get('/profil/' + options.slug + currentPage(options.page !== undefined ? options.page : undefined)).catch((err) => err.response);

            if(res.status === 200) {
                commit('SET_POSTS', res.data.rows);
                commit('user/SET_USER', res.data.user, { root: true });
            }

            return res;
        },
        async loadPost({ commit }, slug) {
            const res = await Api().get('/posts/' + slug ).catch((err) => err.response);

            if(res.status === 200) {
                commit('SET_POST', res.data);
                commit('comments/SET_COMMENT', {post_id: res.data.id, comments : res.data.Comments}, { root: true });
            }

            return res;
        },
        async createPost({commit}, formData) {
            const res = await Api().post('/posts', formData ).catch((err) => err.response);

            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        async updateArticle({commit}, data) {
            const res = await Api().put('/posts/' + data.id, data.formData).catch((err) => err.response);

            if(res.status === 200) { commit('UPDATE_POST', data); }
            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        async updateImage({commit}, post) {
            const res = await Api().put('/posts/' + post.id, { content: post.content, type : '2'}).catch((err) => err.response);

            if(res.status === 200) { commit('UPDATE_POST', post); }
            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        async deletePost({commit}, post_id) {
            const res = await Api().delete('/posts/' + post_id).catch((err) => err.response);

            if(res.status === 200) { commit('DELETE_POST', post_id); }
            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

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
                commit('auth/SET_CURRENT_USER_LIKE', {post_id: data.post_id, like : res.data.cancel === true ? 0 : data.like}, { root: true })
            }

            if (res.status === 500) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true }); }
        },
        async createComment({ commit }, data) {
            const res = await Api().post('/comments', data).catch((err) => err.response);

            if(res.status === 201) {
                commit('ADD_COMMENT', {post_id: data.PostId, comment : res.data.comment});
            }

            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        async updateComment({ commit }, data) {
            const res = await Api().put('/comments/' + data.comment_id, { content : data.content }).catch((err) => err.response);

            if(res.status === 200) {
                commit('UPDATE_COMMENT', {comment_id : data.comment_id, content : data.content, post_id: data.post_id});
                commit('snackbar/SET_SNACKBAR', { text: res.data.message, show : true }, { root: true });
            }

            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        async deleteComment({ commit }, data) {
            const res = await Api().delete('/comments/' + data.comment_id).catch((err) => err.response);

            if(res.status === 200) {
                commit('DELETE_COMMENT', { comment_id : data.comment_id, post_id: data.post_id});
                commit('snackbar/SET_SNACKBAR', { text: res.data.message, show : true }, { root: true });
            }

            if( [401, 404, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}
        }
    }
}
