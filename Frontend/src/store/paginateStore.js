export default {
    namespaced: true,
    state : {
        posts: {},
        users: {},
        comments: {},
    },
    mutations : {
        SET_PAGINATE(state, paginate) {
            state[paginate.model] = paginate.params;
        },
        SET_CURRENT_PAGE(state, data) {
            state[data.model].current_page = data.current_page;
        },
        DELETE_PAGINATE_POSTS(state) {
            state.posts = {};
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
