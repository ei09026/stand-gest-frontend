const state = {
    connectedHubs: [],

    receivedImages: []
}

const getters = {
    isHubConnected (state) {
        return hub => {
            return state.connectedHubs.indexOf(hub) > -1
        }
    },
}

const mutations = {
    hubConnected (state, hub) {
        if (state.connectedHubs.indexOf(hub) < 0) {
            state.connectedHubs.push(hub)
        }
    },

    hubDisconnected (state, hub) {
        var index = state.connectedHubs.indexOf(hub)

        if (index >= 0) {
            state.connectedHubs.splice(index, 1)
        }
    }
}

const actions = {
    hubConnected ({commit}, hub) {
        commit('hubConnected', hub)
    },

    hubDisconnected ({commit}, hub) {
        commit('hubDisconnected', hub)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
