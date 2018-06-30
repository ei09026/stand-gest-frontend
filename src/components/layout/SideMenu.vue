<template>
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav metismenu" id="side-menu">
                <li class="nav-header"
                    :style="navHeaderStyle">

                    <div class="dropdown profile-element">
                        <span>
                            <img class="img-circle"
                                :src="pictureSource">
                        </span>

                        <span>
                            <span class="clear">
                                <span class="block m-t-xs">
                                    <strong class="font-bold user-name"
                                        v-text="authUser.name"></strong>
                                </span>
                            </span>
                        </span>
                    </div>
                </li>

                <loading
                    v-if="!menuLoaded"></loading>

                <li
                    v-for="menu in menus"
                    :key="menu.id"
                    :class="{
                        'active': isMenuActive(menu),
                        'parent': !menu.route
                    }">

                    <router-link
                        v-if="menu.route"
                        :to="menu.route">

                        <i class="fa fa-fw"
                            v-if="menu.icon"
                            :class="[menu.icon]"></i>

                        <span class="nav-label"
                            v-text="$i18n.tc(menu.i18n, 2)"></span>
                    </router-link>

                    <a
                        v-if="!menu.route" href="#">

                        <i class="fa fa-fw"
                            :class="[menu.icon]"></i>

                        <span class="nav-label"
                            v-text="$i18n.tc(menu.i18n, 2)"></span>

                        <span class="fa arrow"></span>
                    </a>

                    <ul class="nav nav-second-level collapse"
                        v-if="!menu.route"
                        :class="{'in': isMenuActive(menu)}">

                        <li
                            v-for="subMenu in menu.subMenus"
                            :key="subMenu.id"
                            :class="{'active': isMenuActive(subMenu)}">

                            <router-link
                                v-if="subMenu.route"
                                :to="subMenu.route">

                                <i class="fa fa-fw"
                                    v-if="subMenu.icon"
                                    :class="[subMenu.icon]"></i>

                                <span class="nav-label"
                                    v-text="$i18n.tc(subMenu.i18n, 2)"></span>
                            </router-link>

                            <a
                                v-if="!subMenu.route" href="#">

                                <i class="fa fa-fw"
                                    :class="[subMenu.icon]"></i>

                                <span class="nav-label"
                                    v-text="$i18n.tc(subMenu.i18n, 2)"></span>

                                <span class="fa arrow"></span>
                            </a>

                            <ul class="nav nav-third-level collapse"
                                :class="{'in': isMenuActive(subMenu)}">

                                <li
                                    v-for="thirdSubMenu in subMenu.subMenus"
                                    :key="thirdSubMenu.id">

                                    <router-link
                                        :to="thirdSubMenu.route">

                                        <i class="fa fa-fw"
                                            v-if="thirdSubMenu.icon"
                                            :class="[thirdSubMenu.icon]"></i>

                                        <span class="nav-label"
                                            v-text="$i18n.tc(thirdSubMenu.i18n, 2)"></span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>

            </ul>
        </div>
    </nav>
</template>

<script>
    import _ from 'lodash'
    import config from '@/core/config'
    import routingUtility from '@/utilities/shared/routing'
    import authService from '@/services/shared/auth.service'
    import requestService from '@/services/shared/request.service'
    import menusService from '@/services/sideMenu/sideMenu.service'
    import Loading from '@/components/shared/Loading'

    export default {
        components: {
            Loading
        },

        props: {
            slugs: {
                type: Array,
                default: []
            }
        },

        data () {
            return {
                cancelToken: null,

                routingUtility,

                menus: [],

                menuLoaded: false
            }
        },

        computed: {
            authUser () {
                return authService.authUser
            },

            pictureSource () {
                let source = null

                if (this.authUser.picture.internal) {
                    source = 'data:image/png;base64,' + this.authUser.picture.pictureInternal.data
                }

                return source
            },

            navHeaderStyle () {
                return {
                    'background-image': 'url(' + routingUtility.buildPath('/static/assets/header-profile.png') + ')'
                }
        },

            activeMenuIds () {
                var self = this

                if (!self.menus.length) {
                    return []
                }

                let currentRoutePath = self.$route.fullPath

                let activeMenuIds = []

                let resolveActiveMenu = menu => {
                    let hasActiveChild = false

                    if (menu.subMenus && menu.subMenus.length) {
                        for (let i = 0; i < menu.subMenus.length; i++) {
                            if (resolveActiveMenu(menu.subMenus[i])) {
                                hasActiveChild = true
                            }
                        }
                    }

                    if (hasActiveChild || (menu.route && routingUtility.buildPath(menu.route) === currentRoutePath)) {
                        activeMenuIds.push(menu.id)

                    return true
                }

                    return false
                }

                for (let i = 0; i < self.menus.length; i++) {
                    resolveActiveMenu(self.menus[i])
                }

                return activeMenuIds
            }
            },

        methods: {
            isMenuActive (menu) {
                return this.activeMenuIds.indexOf(menu.id) >= 0
            },

            fetchMenus () {
                var self = this

                return new Promise((resolve, reject) => {
                    let parameters = {
                        filter: {
                            slugs: self.slugs
                        },

                        cancelToken: self.cancelToken
                    }

                    menusService.retrieve(parameters).then(response => {
                        if (response.data.status === 'success') {
                            let formattedData = []

                            _.forEach(response.data.data.results, (menu) => {
                                if (menu.level === 1) {
                                    var _menu = {
                                        id: menu.id,
                                        internal_description: menu.internalDescription,
                                        parent_menu_id: menu.parentMenuId,
                                        i18n: menu.i18N,
                                        route: menu.router,
                                        icon: menu.icon,
                                        rank: menu.rank,
                                        level: menu.level,
                                        subMenus: []
                                    }

                                    formattedData.push(_menu)
                                } else if (menu.level === 2) {
                                    var menuLevel2 = {
                                        id: menu.id,
                                        internal_description: menu.internalDescription,
                                        parent_menu_id: menu.parentMenuId,
                                        i18n: menu.i18N,
                                        route: menu.router,
                                        icon: menu.icon,
                                        rank: menu.rank,
                                        level: menu.level,
                                        subMenus: []
                                    }

                                    var parentMenu = _.find(formattedData, parentMenu => parentMenu.id === menu.parentMenuId)

                                    if (parentMenu) {
                                        parentMenu.subMenus.push(menuLevel2)
                                    }
                                } else if (menu.level === 3) {
                                    var menuLevel3 = {
                                        id: menu.id,
                                        internal_description: menu.internalDescription,
                                        parent_menu_id: menu.parentMenuId,
                                        i18n: menu.i18N,
                                        route: menu.router,
                                        icon: menu.icon,
                                        rank: menu.rank,
                                        level: menu.level,
                                        subMenus: []
                                    }

                                    var subMenus = _.find(formattedData, subMenu => subMenu.subMenus.length > 0)

                                    if (subMenus !== null) {
                                        var parentSubMenu = _.find(subMenus.subMenus, parentSubMenu => parentSubMenu.id === menu.parentMenuId)

                                        if (parentSubMenu) {
                                            parentSubMenu.subMenus.push(menuLevel3)
                                        }
                                    }
                                }
                            })

                            self.menus = formattedData

                            self.menuLoaded = true

                            resolve(true)
                        }
                    }).catch((response) => {
                        if (response.status) {
                            // ERRO
                        }

                        reject(false)
                    })
                })
            }
        },

        created () {
            this.cancelToken = requestService.cancelToken.create()
        },

        mounted () {
            let self = this

            self.fetchMenus().then(response => {
                self.$nextTick(() => {
                    $('#side-menu').metisMenu()
                })
            })

            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            })
        },

        beforeDestroy () {
            this.cancelToken = requestService.cancelToken.cancelAndCreate(this.cancelToken)
        }
    }
</script>

<style>
</style>
