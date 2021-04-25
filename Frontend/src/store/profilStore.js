import Api from "@/service/api";

export default {
    namespaced: true,
    state : {
        user: {}
    },
    mutations : {
        SET_PROFIL(state, user) {
            state.user = user
        },
    },
    actions: {
        async loadProfil({ commit }, slug) {
            const res = await Api().get('/profil/' + slug);
            if(res.status === 200) {
                commit('SET_PROFIL', res.data.user);
            }
        },
    }
}
