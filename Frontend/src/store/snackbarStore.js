export default {
    namespaced: true,
    state : {
        snackbar: {},
    },
    mutations : {
        SET_SNACKBAR(state, data) {
            state.snackbar = data;
        },
        RESET_SNACKBAR(state) {
            state.snackbar.show = false;

            setTimeout(() => {
                state.snackbar = {};
            }, 300)
        }
    },
    actions: {
        setSnackbar({ commit }, data) {
            commit('SET_SNACKBAR', { show: true, ...data })
        },
        resetSnackbar({ commit }) {
            commit('RESET_SNACKBAR');
        }
    }
}
