<template>
    <div id="wrapper">
        <page>
            <router-view></router-view>
        </page>
    </div>
</template>

<script>
    import config from '@/core/config'
    import env from '@/core/env'
    import configService from '@/services/shared/config.service'
    import updatesService from '@/services/shared/updates.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters} from 'vuex'
    import alertService from '@/services/shared/alert.service'
    import Page from '@/components/layout/Page'

    import signalrService from '@/services/signalr/signalr.service'
    import { NullLogger } from '@aspnet/signalr';

    const currentBuildNumber = config.get('app.build_number', 0)

    let tokenRefresher = null
    let checkForUpdates = null

    export default {
        components: {
            Page
        },

        data () {
            return {
                updateModalVisible: false
            }
        },

        computed: {
            ...mapGetters([
                'openModal'
            ]),

            availableLocales () {
                var available = configService.configuration.locale.available

                return Object.keys(available).map((key, index) => ({
                    code: key,
                    description: available[key]
                }))
            },

            currentLocale: {
                get () {
                    return configService.configuration.locale.current
                },
                
                set (locale) {
                    configService.setLocale(locale)
                }
            },

            routeBodyClass () {
                if (!this.$route.meta || !this.$route.meta.bodyClass) {
                    return null
                }

                return this.$route.meta.bodyClass
            },
        },

        methods: {
            logout () {
                authService.logout()
            },

            updateModalBodyClass () {
                let hasClass = document.body.className.indexOf('modal-open') >= 0

                if (this.openModal) {
                    if (!hasClass) {
                        document.body.className += ' modal-open'
                    }
                } else {
                    if (hasClass) {
                        document.body.className = document.body.className.replace(/\bmodal-open\b/, '')
                    }
                }
            },

            updateBodyClass (newClass, oldClass) {
                let hasOldClass = (new RegExp('\\b' + oldClass + '\\b', 'g')).test(document.body.className)

                let hasNewClass = (new RegExp('\\b' + newClass + '\\b', 'g')).test(document.body.className)

                if (oldClass && hasOldClass) {
                    document.body.className = document.body.className.replace(new RegExp('\\b' + oldClass + '\\b', 'g'), '')
                }

                if (newClass && !hasNewClass) {
                    document.body.className += ' ' + newClass
                }
            },

            refreshToken () {
                if (this.$route.path === '/login') {
                    return
                }

                // Silently refresh token.
                try {
                    authService.refreshToken()
                } catch (ex) {}
            },

            checkForUpdates () {
                let self = this

                if (self.updateModalVisible || self.$route.path === '/login') {
                    return
                }

                updatesService.checkForUpdates({buildNumber: currentBuildNumber}).then(updatesAvailable => {
                    if (updatesAvailable) {
                        self.updateModalVisible = true

                        let title =
                            + '<small>'
                            + self.$i18n.t('app.new-version-available')
                            + '<br>' + self.$i18n.t('app.do-you-want-to-update')
                            + '<br><b>' + self.$i18n.t('app.check-that-you-are-not-in-the-middle-of-a-process') + '</b>'
                            + '</small>'

                        alertService.advanced({
                            title,
                            type: 'warning',
                            showCancelButton: true
                        }).then(() => {
                            window.location.reload(true)
                        }).catch(() => {
                            self.updateModalVisible = false
                        })
                    }
                })
            }

        },

        watch: {
            openModal () {
                this.updateModalBodyClass()
            },

            routeBodyClass (newClass, oldClass) {
                this.updateBodyClass(newClass, oldClass)
            }
        },

        mounted () {
            let self = this

            self.updateBodyClass(self.routeBodyClass, null)

            window.abortLoadingScreen = true

            this.$nextTick(() => {
                if (window.loadingScreenActive) {
                    window.loadingScreen.finish()
                    window.loadingScreen = null
                }
            })
        },

        beforeDestroy () {
        }
    }
</script>

<style>
    body:not(.modal-open) {
        overflow-y: scroll;
    }

    #page {
        height: 100%;
    }

    body.fixed-nav #wrapper #page-wrapper.full-content {
        margin: 0px;
    }

    .navbar-brand {
        padding: 20px 25px;
    }

    .flex {
        display: flex;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-row-reverse {
        flex-direction: row-reverse;
    }

    .flex-column {
        flex-direction: column;
    }

    .flex-column-reverse {
        flex-direction: column-reverse;
    }

    .flex-justify-center {
        justify-content: center;
    }

    .flex-justify-start {
        justify-content: flex-start;
    }

    .flex-justify-end {
        justify-content: flex-end;
    }

    .flex-justify-between {
        justify-content: space-between;
    }

    .flex-justify-around {
        justify-content: space-around;
    }

    .flex-align-center {
        align-items: center;
    }

    .flex-align-start {
        align-items: flex-start;
    }

    .flex-align-end {
        align-items: flex-end;
    }

    .flex-wrap {
        flex-wrap: wrap;
    }

    .flex-wrap-reverse {
        flex-wrap: wrap-reverse;
    }

    .panel.panel-transparent {
        border: none!important;
        background: 0 0;
    }

    .panel.panel-transparent>.panel-heading {
        border-bottom: 1px solid #e2e2e2;
    }

    .panel.panel-transparent>.panel-heading,
    .panel.panel-transparent>.panel-body {
        background: 0 0;
    }

    .btn-outline.disabled {
        color: #fff;
    }

    table.row-pointer tr td {
        cursor: pointer;
    }

    textarea.resize-none {
        resize: none;
    }

    textarea.resize-h {
        resize: vertical;
        min-height: 34px;
    }

    textarea.resize-w {
        resize: horizontal;
        min-width: 200px;
    }

    .ibox.ibox-new>.ibox-title,
    .ibox.ibox-new>.ibox-content {
        border-top-color: #1ab394;
    }

    .ibox.ibox-new>.ibox-title+.ibox-content {
        border-top-color: #e7eaec;
    }

    .ibox>.ibox-title>.ibox-tools>.btn.btn-circle {
        margin-top: -5px;
    }

    .bg-success-light {
        color: #3c763d;
        background-color: #dff0d8;
    }

    .bg-info-light {
        color: #31708f;
        background-color: #d9edf7;
    }

    .bg-warning-light {
        color: #8a6d3b;
        background-color: #fcf8e3;
    }

    .bg-danger-light {
        color: #a94442;
        background-color: #f2dede;
    }

    .pointer {
        cursor: pointer;
    }

    /* Animation */
    .fade-in-enter-active,
    .fade-out-leave-active,
    .fade-in-out-enter-active,
    .fade-in-out-leave-active {
        -webkit-animation-duration: 0.6s;
        animation-duration: 0.6s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .fade-in-enter-active,
    .fade-in-out-enter-active {
        -webkit-animation-name: fadeIn;
        animation-name: fadeIn;
    }

    .fade-out-leave-active,
    .fade-in-out-leave-active {
        -webkit-animation-name: fadeOut;
        animation-name: fadeOut;
    }

    .btn-outline {
        transition: all .5s, visibility 0s;
    }

    /* Multiselect fix */
    .multiselect .multiselect__tags {
        padding-top: 5px;
    }

    .multiselect .multiselect__tags .multiselect__tag {
        margin-bottom: 5px;
    }

    /* Totalizers */
    .totalizers {
        padding-bottom: 0px;
        display: flex;
        justify-content: space-between;
    }

    .totalizer {
        display: flex;
        align-items: flex-end;
        margin-bottom: 15px;
    }

    .totalizer>span {
        text-transform: uppercase;
        margin: 0px 10px 1px 0px;
    }

    .totalizer>h1 {
        margin: 0px;
    }

    .navbar-fixed-top {
        position: relative;
    }

    body.fixed-nav #wrapper #page-wrapper.no-side-menu {
        margin-left: 0px;
    }
</style>
