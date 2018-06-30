<template>
    <div id="page">
        <side-menu
            v-if="pageHasSideMenu"
            :slugs="['frontoffice']"></side-menu>

        <div id="page-wrapper"
            :class="{
                'full-content': this.fullContent,
                'no-side-menu': !this.pageHasSideMenu
            }"
            :style="pageWrapperStyle">

            <div id="navbar-wrapper" class="row"
                v-if="!fullContent">

                <navbar></navbar>
            </div>

            <div class="wrapper wrapper-content"
                :class="pageWrapperClass"
                :style="contentWrapperStyle">

                <slot></slot>
            </div>

            <footer-bar
                v-if="!fullContent"
                :has-side-menu="this.pageHasSideMenu"></footer-bar>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import authService from '@/services/shared/auth.service'
    import SideMenu from '@/components/layout/SideMenu'
    import Navbar from '@/components/layout/Navbar'
    import FooterBar from '@/components/layout/FooterBar'

    const NAVBAR_HEIGHT = 61
    const FOOTER_HEIGHT = 40
    const BUTTON_BAR_HEIGHT = 50

    export default {
        components: {
            SideMenu,
            Navbar,
            FooterBar
        },

        computed: {
            ...mapGetters([
                'pageContentSize',
                'pageMinHeight',
                'pageHasSideMenu',
                'pageHasButtonBar'
            ]),

            fullContent () {
                return !!(this.$route.meta && this.$route.meta.fullContent)
            },

            routeSideMenu () {
                if (!this.$route.meta || this.$route.meta.sideMenu === undefined) {
                    return null
                }
                
                return !!this.$route.meta.sideMenu
            },

            pageWrapperClass () {
                return this.$route.meta && this.$route.meta.pageClass
                    ? this.$route.meta.pageClass
                    : null
            },

            pageWrapperStyle () {
                return {
                    minHeight: this.pageMinHeight + 'px'
                }
            },

            contentWrapperStyle () {
                let style = {}

                if (this.pageHasButtonBar) {
                    Object.assign(style, {marginBottom: FOOTER_HEIGHT + BUTTON_BAR_HEIGHT + 'px'})
                }

                return style
            }
        },

        methods: {
            ...mapActions([
                'setPageMinHeight',
                'setPageHasSideMenu'
            ]),

            updatePageMinHeight () {
                let reservedHeight = this.fullContent ? 0 : (NAVBAR_HEIGHT + FOOTER_HEIGHT + (this.pageHasButtonBar ? BUTTON_BAR_HEIGHT : 0))

                let minHeight = this.pageContentSize.height - reservedHeight

                this.setPageMinHeight(minHeight)
            },

            updatePageHasSideMenu (fullContent, routeSideMenu) {
                if (fullContent || !authService.hasClaim('CRITICAL_OPERATIONS')) {
                    this.setPageHasSideMenu(false)
                    return
                }

                if (routeSideMenu !== null) {
                    this.setPageHasSideMenu(routeSideMenu)
                    return
                }

                this.setPageHasSideMenu(true)
            }
        },

        watch: {
            fullContent (fullContent) {
                this.updatePageHasSideMenu(fullContent, this.routeSideMenu)
                this.updatePageMinHeight()
            },

            routeSideMenu (hasSideMenu) {
                this.updatePageHasSideMenu(this.fullContent, hasSideMenu)
            },

            'pageContentSize.height' (value) {
                this.updatePageMinHeight()
            }
        },

        created () {
            this.updatePageHasSideMenu(this.fullContent, this.routeSideMenu)
            this.updatePageMinHeight()
        }
    }
</script>
