import store from '@/vuex/store'

export default {
    config: {
        runs: 'before',
        name: 'clearModal',
        global: true
    },

    handle (to, from, next, middlewareParams) {
        store.dispatch('modalCloseAny')

        next()
    }
}
