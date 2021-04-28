import Vue from "vue";
import Api from "@/service/api";

export default {
    namespaced: true,
    mutations : {
        SET_COMMENT (state, data) {
            Vue.set(state, data.post_id, data);
        },
        SET_COMMENTS(state, comments) {
            comments.forEach(comment => {
                Vue.set(state, comment.post_id, comment);
            })
        },
        ADD_COMMENT(state, data) {
            if(data.comment.ParentId === undefined) {
                data.comment.ParentId = null;
            }

            state[data.post_id].comments.push(data.comment);
        },
        TOGGLE_ANSWERS(state, data) {
            state[data.post_id].comments.forEach( comment => {
                if(comment.id === data.comment_id) {
                    Vue.set(comment, 'showAnswers', !comment.showAnswers);
                }
            })
        },
        TOGGLE_TEXTAREA(state, data) {
            state[data.post_id].comments.forEach( comment => {
                if(comment.id === data.comment_id) {
                    Vue.set(comment, 'showTextarea', data.state !== undefined ? data.state : !comment.showTextarea);
                }
            })
        },
        SHOW_ANSWERS(state, data) {
            state[data.post_id].comments.forEach( comment => {
                if(comment.id === data.comment_id) {
                    Vue.set(comment, 'showAnswers', true);
                }
            })
        },
    },
    actions: {
        async loadComments({ commit }) {
            const res = await Api().get('/comments');
            if(res.status === 200) {
                commit('SET_COMMENTS', res.data);
            }
        },
        toggleAnswers({ commit }, data) {
            commit('TOGGLE_ANSWERS', data);
        },
        toggleTextarea({ commit }, data) {
            commit('TOGGLE_TEXTAREA', data);
        },
        async create({ commit }, data) {
            const res = await Api().post('/comments', data);
            if(res.status === 201) {
                commit('ADD_COMMENT', {post_id: data.PostId, comment : res.data.comment});

                if(res.data.comment.ParentId !== undefined) {
                    commit('SHOW_ANSWERS', {post_id: data.PostId, comment_id: res.data.comment.ParentId})
                }
            }

            return res;
        },
    },
    getters: {
        orderComments: (state) => (id) => {
            if(state[id] === undefined) return [];

            const comments = {};
            state[id].comments.forEach(comment => {
                if(comment.ParentId === null) {
                    comments[comment.id] = comment;
                    comments[comment.id].answers = [];
                    return;
                }

                comments[comment.ParentId].answers.push(comment);
            });

            return Object.values(comments);
        }
    }
}
