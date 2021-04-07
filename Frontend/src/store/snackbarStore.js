export default {
    namespaced: true,
    state : {
        snackbar: {}
    },
    mutations : {
        SET_SNACKBAR(state, data) {
            state.snackbar = data;
        },
        RESET_SNACKBAR(state) {
            state.snackbar = {};
        }
    },
    actions: {
        setSnackbar({ commit }, data) {
            commit('SET_SNACKBAR', { text : data.text, show: true })
        },
        resetSnackbar({ commit }) {
            commit('RESET_SNACKBAR');
        }
    }
}
