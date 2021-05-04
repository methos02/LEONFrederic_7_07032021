import Api from "@/service/api";

export default {
    namespaced: true,
    state : {
        nav_search: [],
        admin_search: []
    },
    mutations : {
        SET_NAV_SEARCH(state, users) {
            state.nav_search = users;
        },
        RESET_NAV_SEARCH(state) {
            state.nav_search = [];
        },
        SET_ADMIN_SEARCH(state, users) {
            state.admin_search = users;
        }
    },
    actions: {
        async searchNav({commit}, search) {
            if(search !== '' ) {
                const res = await Api().get('/profil/search/' + search).catch(err => err.response);
                if(res.status === 200) { commit('search/SET_NAV_SEARCH', res.data.users, { root: true }); }
                return res;
            }

            commit('search/SET_NAV_SEARCH', [], { root: true });
        },
        async searchAdmin({commit}, search) {
            if(search !== '' ) {
                const res = await Api().get('/admin/search/' + search).catch(err => err.response);
                if(res.status === 200) { commit('search/SET_ADMIN_SEARCH', res.data.users, { root: true }); }
                return res;
            }

            commit('search/SET_ADMIN_SEARCH', [], { root: true });
        },
        resetNavSearch({ commit }) {
            commit('search/RESET_NAV_SEARCH', '', { root: true });
        },
    },
}
