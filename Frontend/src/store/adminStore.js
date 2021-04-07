import Api from "@/service/api";

export default {
    namespaced: true,
    state : {
        comments: {}
    },
    mutations : {
        SET_COMMENTS(state, comments) {
            state.comments = comments;
        },
        REMOVE_COMMENT(state, comment_id) {
            state.comments = state.comments.filter( comment => comment.id !== comment_id && comment.AnswerId !== comment_id);
        }
    },
    actions: {
        async loadComments({ commit }) {
            const res = await Api().get('/comments');
            if(res.status === 200) {
                commit('SET_COMMENTS', res.data);
            }
        },
        async removeComment({ commit }, comment_id) {
            const res = await Api().delete('/comments/' + comment_id);console.log(res.status === 200)
            if(res.status === 200) {
                commit('REMOVE_COMMENT', comment_id);
            }

            return res;
        }
    },
}
