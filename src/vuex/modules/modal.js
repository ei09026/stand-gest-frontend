const state = {
    openModal: null
}

const getters = {
    openModal: state => state.openModal
}

const mutations = {
    modalOpen (state, modal) {
        state.openModal = modal
    },

    modalClose (state) {
        state.openModal = null
    }
}

const actions = {
    /*
    modal: {
        key: *uid*,
        priority: 1 // (optional)
    }
    */

    modalOpen ({state, commit}, modal) {
        let finalModal = Object.assign({}, {
            priority: 1
        }, modal)

        if (state.openModal && state.openModal.priority > finalModal.priority) {
            return
        }

        commit('modalOpen', finalModal)
    },

    modalClose ({state, commit}, modal) {
        if (!state.openModal || (modal && modal.key !== state.openModal.key)) {
            return
        }

        commit('modalClose')
    },

    modalCloseAny ({state, commit}) {
        commit('modalClose')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
