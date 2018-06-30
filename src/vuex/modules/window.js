const state = {
    pageContentSize: {
        width: 0,
        height: 0
    },

    pageMinHeight: 0,

    pageHasSideMenu: false,

    // We use a uniquely identified ButtonBar buffer
    // to deal with concurrent instances
    buttonBarBuffer: []
}

const getters = {
    pageContentSize (state) {
        return state.pageContentSize
    },

    pageMinHeight (state) {
        return state.pageMinHeight
    },

    pageHasSideMenu (state) {
        return state.pageHasSideMenu
    },

    pageHasButtonBar (state) {
        return state.buttonBarBuffer.length > 0
    },

    pageButtonBarHeight (state) {
        return state.buttonBarBuffer.length > 0 ? 50 : 0
    }
}

const mutations = {
    setPageContentWidth (state, width) {
        state.pageContentSize.width = width
    },

    setPageContentHeight (state, height) {
        state.pageContentSize.height = height
    },

    setPageMinHeight (state, height) {
        state.pageMinHeight = height
    },

    setPageHasSideMenu (state, pageHasSideMenu) {
        state.pageHasSideMenu = pageHasSideMenu
    },

    addButtonBar (state, uid) {
        if (state.buttonBarBuffer.indexOf(uid) < 0) {
            state.buttonBarBuffer.push(uid)
        }
    },

    removeButtonBar (state, uid) {
        var index = state.buttonBarBuffer.indexOf(uid)

        if (index >= 0) {
            state.buttonBarBuffer.splice(index, 1)
        }
    }
}

const actions = {
    setPageContentWidth ({commit}, width) {
        commit('setPageContentWidth', width)
    },

    setPageContentHeight ({commit}, height) {
        commit('setPageContentHeight', height)
    },

    setPageMinHeight ({commit}, height) {
        commit('setPageMinHeight', height)
    },

    setPageContentSize ({commit}, size) {
        commit('setPageContentWidth', size.width)
        commit('setPageContentHeight', size.height)
    },

    setPageHasSideMenu ({commit}, pageHasSideMenu) {
        commit('setPageHasSideMenu', pageHasSideMenu)
    },

    addButtonBar ({commit}, uid) {
        commit('addButtonBar', uid)
    },

    removeButtonBar ({commit}, uid) {
        commit('removeButtonBar', uid)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
