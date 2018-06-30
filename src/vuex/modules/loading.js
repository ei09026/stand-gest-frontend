const state = {
    loadings: [],

    globalLoadings: []
}

const getters = {
    isLoading (state) {
        return !!state.loadings.length
    },

    firstLoading (state) {
        return state.loadings.length ? state.loadings[0] : null
    },

    loadings (state) {
        return state.loadings
    },

    isGlobalLoading (state) {
        return state.globalLoadings
    },

    firstGlobalLoading (state) {
        return state.globalLoadings.length ? state.globalLoadings[0] : null
    },

    globalLoadings (state) {
        return state.globalLoadings
    }
}

const mutations = {
    loadingAdd (state, loading) {
        if (state.loadings.indexOf(loading) < 0) {
            state.loadings.push(loading)
        }
    },

    loadingRemove (state, loading) {
        var index = state.loadings.indexOf(loading)

        if (index >= 0) {
            state.loadings.splice(index, 1)
        }
    },

    clearLoadings (state) {
        state.loadings = []
    },

    globalLoadingAdd (state, loading) {
        if (state.globalLoadings.indexOf(loading) < 0) {
            state.globalLoadings.push(loading)
        }
    },

    globalLoadingRemove (state, loading) {
        var index = state.globalLoadings.indexOf(loading)

        if (index >= 0) {
            state.globalLoadings.splice(index, 1)
        }
    },
}

const actions = {
    loadingAdd ({commit}, loading) {
        commit('loadingAdd', loading)
    },

    loadingRemove ({commit}, loading) {
        commit('loadingRemove', loading)
    },

    clearLoadings ({commit}) {
        commit('clearLoadings')
    },

    globalLoadingAdd ({commit}, loading) {
        commit('globalLoadingAdd', loading)
    },

    globalLoadingRemove ({commit}, loading) {
        commit('globalLoadingRemove', loading)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
