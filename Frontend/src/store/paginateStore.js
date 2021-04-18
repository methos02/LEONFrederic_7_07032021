export default {
    namespaced: true,
    state : {
        posts: {},
        users: {}
    },
    mutations : {
        SET_PAGINATE(state, paginate) {
            state[paginate.model] = paginate.params;
        },
        SET_CURRENT_PAGE(state, data) {
            state[data.model].current_page = data.current_page;
        }
    },
    actions: {
        setPaginate({ commit }, paginate) {
            commit('SET_PAGINATE', paginate);
        },
        setCurrentPage({ commit }, data) {
            commit('SET_CURRENT_PAGE', data);
        },
    },
}
