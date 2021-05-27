import Api from "@/service/api";

export default {
    namespaced: true,
    state : {
        current_user: {},
    },
    mutations : {
        SET_CURRENT_USER(state, user) {
            state.current_user = user;
        },
        UPDATE_CURRENT_USER_PROFIL(state, user) {
            state.current_user.name = user.name;
            state.current_user.lastname = user.lastname;
            state.current_user.firstname = user.firstname;
            state.current_user.email = user.email;

            if(user.avatar !== undefined) {
                state.current_user.avatar = user.avatar;
                state.current_user.avatarPath = user.avatarPath;
            }
        },
        SET_CURRENT_USER_LIKE(state, data) {
            if(data.like === 0) {
                return state.current_user.likes = state.current_user.likes.filter(like => like.PostId !== data.post_id);
            }

            if(state.current_user.likes.find(like => like.PostId === data.post_id) === undefined) {
                return state.current_user.likes.push({PostId : data.post_id, like : data.like});
            }

            state.current_user.likes.forEach(like => {
                if(like.PostId === data.post_id) {
                    like.like = data.like;
                }
            });
        },
        DELETE_CURRENT_USER(state) {
            state.current_user = {}
        },
    },
    actions: {
        async getCurrentUser({ commit }) {
            const res = await Api().get('/auth/current_user').catch(() => false);

            if(res.status === 200) {
                commit('SET_CURRENT_USER', res.data);
            }

            return res;
        },
        async userLogin({commit}, loginData) {
            const res = await Api().post('/auth/login', loginData).catch((err) => err.response);

            if(res.status === 200) {
                commit('SET_CURRENT_USER', res.data.user);
                localStorage.setItem('token', res.data.user.token);
            }

            return res;
        },
        async userRegister({commit}, loginData) {
            const res = await Api().post('/auth/signup', loginData).catch((err) => err.response);

            if(res.status === 201) {
                commit('SET_CURRENT_USER', res.data.user);
                localStorage.setItem('token', res.data.user.token);
            }

            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
        logout({ commit }) {
            commit('DELETE_CURRENT_USER');
            localStorage.removeItem('token');
        },
        async updateProfil({commit}, formData) {
            const res = await Api().put('/profil/' , formData).catch(err => err.response);

            if(res.status === 200) { commit('UPDATE_CURRENT_USER_PROFIL', res.data.data); }
            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },

        // eslint-disable-next-line no-empty-pattern
        async updatePassword( {},  passData ) {
            return await Api().put('/profil/password', passData).catch(err => err.response);
        },
        async deleteProfil({commit}) {
            const res = await Api().delete('/profil/').catch(err => err.response);

            if(res.status === 200) {
                commit('DELETE_CURRENT_USER');
                localStorage.removeItem('token');
            }

            if( [401, 500].indexOf(res.status) !== -1 ) { commit('snackbar/SET_SNACKBAR', { text: res.data.error, type: 'error', show : true }, { root: true });}

            return res;
        },
    }
}
