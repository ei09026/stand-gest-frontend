const state = {
    changePassword: {
        modalIsOpen: false
    },

    session: {
        id: null,
        typeId: null,
        clientSessionStarted: false,
        lastImageReceived: null,
        checklistCompleted: false,
        clientReferenceCompleted: false,
        documentValidated: false        
    }
}

const getters = {
    changePassword: state => {
        return state.changePassword
    },

    clientSessionStarted: state => {
        return state.session.clientSessionStarted
    },

    getSessionId: state => {
        return state.session.id
    },

    getLastImageReceived: state => {
        return state.session.lastImageReceived
    },

    isChecklistCompleted: state => {
        return state.session.checklistCompleted === true
    },

    isClientReferenceCompleted: state => {
        return state.session.clientReferenceCompleted === true
    },

    isDocumentValidated: state => {
        return state.session.documentValidated === true
    },

    getSessionTypeId: state => {
        return state.session.typeId
    },

}

const mutations = {
    openChangePasswordModal: state => {
        state.changePassword.modalIsOpen = true
    },

    closeChangePasswordModal: state => {
        state.changePassword.modalIsOpen = false
    },

    startClientSession: state => {
        state.session.clientSessionStarted = true
    },

    closeClientSession: state => {
        state.session.clientSessionStarted = false
    },

    setSessionId: (state, sessiondId) => {
        state.session.id = sessiondId
    },

    setLastImageReceived: (state, image) => {
        state.session.lastImageReceived = image
    },

    checklistCompleted: (state, done) => {
        state.session.checklistCompleted = done
    },

    documentValidated: (state, validated) => {
        state.session.documentValidated = validated
    },

    clientReferenceCompleted: (state, completed) => {
        state.session.clientReferenceCompleted = completed
    },

    setSessionTypeId: (state, typeId) => {
        state.session.typeId = typeId
    },
}

const actions = {
    openChangePasswordModal ({commit}) {
        commit('openChangePasswordModal')
    },

    closeChangePasswordModal ({commit}) {
        commit('closeChangePasswordModal')
    },

    startClientSession ({commit}) {
        commit('startClientSession')
    },

    closeClientSession ({commit}) {
        commit('closeClientSession')
    },

    setSessionId ({commit}, sessionId) {
        commit('setSessionId', sessionId)
    },

    setLastImageReceived ({commit}, image) {
        commit('setLastImageReceived', image)
    },

    checklistCompleted ({commit}, done) {
        commit('checklistCompleted', done)
    },

    documentValidated ({commit}, validated) {
        commit('documentValidated', validated)
    },

    clientReferenceCompleted ({commit}, completed) {
        commit('clientReferenceCompleted', completed)
    },

    setSessionTypeId ({commit}, typeId) {
        commit('setSessionTypeId', typeId)
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}
