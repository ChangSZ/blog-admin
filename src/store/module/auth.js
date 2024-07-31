// store/modules/auth.js
import axios from 'axios';

const state = {
    token: localStorage.getItem('token') || null,
    refreshTimer: null,
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },
    SET_REFRESH_TIMER(state, timer) {
        state.refreshTimer = timer;
    },
};

const actions = {
    setToken({ commit, dispatch }, token) {
        commit('SET_TOKEN', token);
        dispatch('setRefreshTimer');
    },
    setRefreshTimer({ commit, dispatch }) {
        const currentTimer = state.refreshTimer;
        if (currentTimer) {
            clearInterval(currentTimer);
        }

        const timer = setInterval(() => {
            dispatch('refreshToken');
        }, 600000); // 10分钟

        commit('SET_REFRESH_TIMER', timer);
    },
    refreshToken({ state }) {
        return axios.post('/console/refresh-token', {}, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-auth-token': state.token,
            }
        }).then(response => {
            // console.log("refresh token ok");
        }).catch(error => {
            console.error('Failed to refresh token:', error);
            // Handle token refresh error, such as logging out the user
        });
    },
    unsetToken({ commit }) {
        commit('SET_TOKEN', null);
        const currentTimer = state.refreshTimer;
        if (currentTimer) {
            clearInterval(currentTimer);
            commit('SET_REFRESH_TIMER', null);
        }
    }
};

const getters = {
    token: state => state.token,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
