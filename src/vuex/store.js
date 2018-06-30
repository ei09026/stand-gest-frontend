import Vue from 'vue'
import Vuex from 'vuex'

import window from './modules/window'
import context from './modules/context'
import loading from './modules/loading'
import modal from './modules/modal'
import signalr from './modules/signalr'

Vue.use(Vuex)

export default new Vuex.Store({
    // combine sub modules
    modules: {
        window,
        context,
        loading,
        modal,
        signalr
    }
})
