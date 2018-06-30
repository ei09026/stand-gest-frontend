import store from '@/vuex/store'

export default {
    config: {
        runs: 'before',
        name: 'clearLoadings',
        global: true
    },

    handle (to, from, next, middlewareParams) {
        store.dispatch('clearLoadings')

        next()
    }
}
