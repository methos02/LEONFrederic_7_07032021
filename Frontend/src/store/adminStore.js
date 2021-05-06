import Api from "@/service/api";
import currentPage from "@/utils/paginateHelper";

export default {
    namespaced: true,
    state : {
        comments: {},
        users: {}
    },
    mutations : {
        SET_COMMENTS(state, comments) {
            state.comments = comments;
        },
        REMOVE_COMMENT(state, comment_id) {
            state.comments = state.comments.filter( comment => comment.id !== comment_id && comment.AnswerId !== comment_id);
        },
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
            const res = await Api().delete('/comments/' + comment_id);
            if(res.status === 200) {
                commit('REMOVE_COMMENT', comment_id);
            }

            return res;
        },
        async updateRoles({commit}, data) {
            const res = await Api().put('profil/roles/' + data.user_id, { roles : data.roles }).catch((err) => err.response);

            if(res.status === 200) {
                commit('user/UPDATE_ROLES', data.roles, { root: true });
            }

            return res;
        },
        async loadUsers({commit}, page) {
            const res = await Api().get('/admin/users' + currentPage(page !== undefined ? page : undefined)).catch(err => err.response);
            if (res.status === 200) {
                commit('SET_USERS', res.data.rows);
                commit('paginate/SET_PAGINATE', {model: 'users', params: res.data.paginate}, {root : true});
            }
        },
        async banUser({commit}, data) {
            const res = await Api().put('/admin/users/' + data.user_id + '/ban', {
                UserId: data.user_id,
                message: data.message
            }).catch(err => err.response);
            if (res.status === 200) {
                commit('BAN_USER', {
                    user_id: data.user_id,
                    banUntil: res.data.banUntil,
                    formatBanUntil: res.data.formatBanUntil
                })
            }
            return res;
        }
    },
}
