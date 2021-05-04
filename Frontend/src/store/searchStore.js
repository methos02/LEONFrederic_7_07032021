import Api from "@/service/api";

export default {
    namespaced: true,
    state : {
        users: []
    },
    mutations : {
        SET_USERS(state, users) {
            state.users = users;
        },
        RESET_USERS(state) {
            state.users = [];
        }
    },
    actions: {
        async searchUsers({commit}, search) {
            if(search !== '' ) {
                const res = await Api().get('/profil/search/' + search).catch(err => err.response);
                if(res.status === 200) { commit('search/SET_USERS', res.data.users, { root: true }); }
                return res;
            }

            commit('search/SET_USERS', [], { root: true });
        },
        resetUsers({ commit }) {
            commit('search/RESET_USERS', '', { root: true });
        }
    },
}
