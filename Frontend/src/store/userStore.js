export default {
    namespaced: true,
    state : {
        user: {}
    },
    mutations : {
        SET_USER(state, user) {
            state.user = user;
        },
        UPDATE_ROLES(state, roles) {
            state.user.roles = roles
        }
    },
}
