import Vue from "vue";

export default {
    namespaced: true,
    mutations : {
        SET_COMMENT (state, data) {
            Vue.set(state, data.post_id, data);
        },

    },
}
