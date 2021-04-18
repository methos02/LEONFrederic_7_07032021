import Api from "@/service/api";
import currentPage from "@/utils/paginateHelper";

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
        async loadComments({ commit }, page) {
            const res = await Api().get('admin/comments' + currentPage(page !== undefined ? page : undefined));
            if(res.status === 200) {
                commit('SET_COMMENTS', res.data.rows);
                commit('paginate/SET_PAGINATE', {model: 'comments', params: res.data.paginate}, { root: true });
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
