<template>
    <div class="footer fixed"
        :class="{'no-side-menu': !hasSideMenu}">
        <div class="pull-right">
            <div class="sk-spinner sk-spinner-wave"
                v-show="isLoading">
                <div class="sk-rect1"></div>
                <div class="sk-rect2"></div>
                <div class="sk-rect3"></div>
                <div class="sk-rect4"></div>
                <div class="sk-rect5"></div>
            </div>
        </div>

        <div>
            <span
                v-tooltip="{title: 'Build: ' + buildNumber, placement: 'right'}">

                <i class="fa fa-code-branch m-r-xs"></i> v1.0
            </span>
            &nbsp;&nbsp;
            <span
                v-tooltip="{title: connectionStatusDescription, placement: 'right'}">
                <i class="fas fa-broadcast-tower m-r-xs"></i><i :class="connectionStatusIcon"></i>
            </span>

            <i class="fa fa-certificate m-l-md m-r-xs"></i> Copyright © {{ currentYear }}

            <img class="logo m-l-md"
                :src="logo">
        </div>
    </div>
</template>

<script>
    import config from '@/core/config'
    import moment from 'moment'
    import routingUtility from '@/utilities/shared/routing'
    import {mapGetters} from 'vuex'
    import tooltip from '@/directives/tooltip'
    import signalr from '@/services/signalr/signalr.service'

    export default {
        directives: {
            tooltip
        },

        props: {
            hasSideMenu: {
                type: Boolean,
                default: true
            }
        },


        data () {
            return {
                buildNumber: config.get('app.build_number')
            }
        },

        computed: {
            ...mapGetters([
                'isLoading',
                'isHubConnected'
            ]),

            currentYear () {
                return moment().format('YYYY')
            },

            logo () {
                return routingUtility.buildPath('/static/assets/manufacturer-logo.png')
            },

            connectionStatusIcon () {
                return this.isHubConnected(signalr.hubs.status.connection.connection.baseUrl) ? 'fas fa-check' : 'fas fa-times'
            },

            connectionStatusDescription () {
                return this.isHubConnected(signalr.hubs.status.connection.connection.baseUrl) ?
                    this.$i18n.t('signalr.connected-to-server') : this.$i18n.t('signalr.disconnected-from-server')
            }
        }
    }
</script>

<style>
    .footer .logo {
        height: 15px;
    }

    .footer.fixed.no-side-menu {
        margin-left: 0px;
    }
</style>
