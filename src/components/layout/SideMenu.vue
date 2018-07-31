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
                return {
                    name: "Nelson Matos",
                    picture: "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"
                }
            },

            pictureSource () {
                let source = null

                if (this.authUser.picture) {
                    source = 'data:image/png;base64,' + this.authUser.picture
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

                    var response = {
                        "status":"success",
                        "message":"",
                        "error_code":"",
                        "data":{
                            "itemsPerPage":20,
                            "page":1,
                            "totalItems":16,
                            "results":[
                                {
                                    "id":1,
                                    "internalDescription":"Home",
                                    "parentMenuId":null,
                                    "router":"/",
                                    "i18N":"side-menu.home",
                                    "icon":"fa-home",
                                    "rank":10,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 2,
                                    "internalDescription":"Configurations",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.configurations",
                                    "icon":"fa-cogs",
                                    "rank":20,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 3,
                                    "internalDescription":"brandsAndModels",
                                    "parentMenuId": 2,
                                    "router": "/configurations/brands",
                                    "i18N":"side-menu.brandsAndModels",
                                    "icon":null,
                                    "rank": 20,
                                    "slug":null,
                                    "level": 2,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 4,
                                    "internalDescription":"fuelTypes",
                                    "parentMenuId": 2,
                                    "router": "/configurations/fuel-types",
                                    "i18N":"side-menu.fuelTypes",
                                    "icon":null,
                                    "rank": 30,
                                    "slug":null,
                                    "level": 2,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 5,
                                    "internalDescription":"categories",
                                    "parentMenuId": 2,
                                    "router": "/configurations/categories",
                                    "i18N":"side-menu.fuelTypes",
                                    "icon":null,
                                    "rank": 40,
                                    "slug":null,
                                    "level": 2,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 6,
                                    "internalDescription":"Vehicles",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.vehicles",
                                    "icon":"fa-car",
                                    "rank":10,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 7,
                                    "internalDescription":"Clients",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.clients",
                                    "icon":"fa-users",
                                    "rank":10,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id": 8,
                                    "internalDescription":"Negotiations",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.negotiations",
                                    "icon":"fa-briefcase",
                                    "rank":10,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                }
                                /*{
                                    "id":8,
                                    "internalDescription":"Users",
                                    "parentMenuId":null,
                                    "router":"/users",
                                    "i18N":"side-menu.users",
                                    "icon":"fa-users",
                                    "rank":30,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id":9,
                                    "internalDescription":"Agencies",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.agencies",
                                    "icon":"fa-building",
                                    "rank":40,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id":19,
                                    "internalDescription":"Activity",
                                    "parentMenuId":null,
                                    "router":null,
                                    "i18N":"side-menu.activity",
                                    "icon":"fa-history",
                                    "rank":80,
                                    "slug":null,
                                    "level":1,
                                    "permission":null,
                                    "enabled":"True"
                                },
                                {
                                    "id":24,
                                    "internalDescription":"Agencies Maintenacne",
                                    "parentMenuId":9,
                                    "router":"/agencies",
                                    "i18N":"side-menu.maintenance",
                                    "icon":null,
                                    "rank":5,
                                    "slug":null,
                                    "level":2,
                                    "permission":null,
                                    "enabled":"True"
                                }*/
                            ]
                        }
                    };
                                /*{"id":10,"internalDescription":"Agencies Access Restrictions","parentMenuId":9,"router":"/agencies/access-restrictions","i18N":"side-menu.access-restrictions","icon":null,"rank":10,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"claims\": [\r\n\t\t\"BO_AGENCIES_ACCESS_RESTRICTIONS\"\r\n\t]\r\n}\r\n","enabled":"True"},{"id":20,"internalDescription":"Audit Trail Authentication","parentMenuId":19,"router":"/audit-trail/authentication","i18N":"side-menu.audit-trail-authentication","icon":null,"rank":10,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"claims\": [\r\n\t\t\"BO_ACTIVITY_AUTHENTICATION\"\r\n\t]\r\n}\r\n","enabled":"True"},{"id":3,"internalDescription":"Forms","parentMenuId":2,"router":"/configurations/forms","i18N":"side-menu.forms","icon":null,"rank":10,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"users\": [\r\n\t\t2,\r\n\t\t5\r\n\t]\r\n}\r\n","enabled":"True"},{"id":4,"internalDescription":"Access Restrictions","parentMenuId":2,"router":"/configurations/access-restrictions","i18N":"side-menu.access-restrictions","icon":null,"rank":20,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"claims\": [\r\n\t\t\"BO_AGENCIES_ACCESS_RESTRICTIONS\"\r\n\t]\r\n}\r\n","enabled":"True"},{"id":5,"internalDescription":"Mobility Config","parentMenuId":2,"router":null,"i18N":"side-menu.mobility","icon":null,"rank":30,"slug":null,"level":2,"permission":null,"enabled":"True"},{"id":21,"internalDescription":"Menu Configuration","parentMenuId":2,"router":"/configurations/menus","i18N":"side-menu.menus","icon":null,"rank":40,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"users\": [\r\n\t\t2,\r\n\t\t5\r\n\t]\r\n}\r\n","enabled":"True"},{"id":22,"internalDescription":"UxTables Configuration","parentMenuId":2,"router":"/configurations/ux-tables","i18N":"side-menu.ux-tables","icon":null,"rank":50,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"claims\": [\r\n\t\t\"BO_CONFIGURATIONS_TABLES\"\r\n\t]\r\n}\r\n","enabled":"True"},{"id":23,"internalDescription":"Client Roles and Claims","parentMenuId":2,"router":"/configurations/authorization","i18N":"side-menu.authorization","icon":null,"rank":50,"slug":null,"level":2,"permission":"\r\n{\r\n\t\"claims\": [\r\n\t\t\"BO_CONFIGURATIONS_AUTHORIZATION\"\r\n\t]\r\n}\r\n","enabled":"True"},{"id":6,"internalDescription":"Mobility Distribution Config","parentMenuId":5,"router":"/configurations/distribution-config","i18N":"side-menu.distribution","icon":null,"rank":10,"slug":null,"level":3,"permission":null,"enabled":"True"},{"id":7,"internalDescription":"Mobility Circuits Config","parentMenuId":5,"router":"/configurations/circuits-config","i18N":"side-menu.circuit","icon":null,"rank":20,"slug":null,"level":3,"permission":null,"enabled":"True"}]}}*/

                    // menusService.retrieve(parameters).then(response => {
                        if (response.status === 'success') {
                            let formattedData = []

                            _.forEach(response.data.results, (menu) => {
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
                    /*}).catch((response) => {
                        if (response.status) {
                            // ERRO
                        }

                        reject(false)
                    })*/
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
