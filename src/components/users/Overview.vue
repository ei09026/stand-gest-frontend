<template>
    <div class="users-overview">
        <page-header
            :active-title="userName"
            :active-picture="{imgSrc: pictureSource, imgClass: 'img-circle'}"
            :breadcrumbs="breadcrumbs"></page-header>

        <loading
            v-show="isLoadingUser"></loading>

        <ul class="nav nav-tabs m-b-sm"
            v-if="user">

            <router-link tag="li" replace exact
                :to="routingUtility.buildPath('/users/' + user.id)">

                <a>
                    <i class="fa fa-eye"></i>

                    {{ $t('users.details.details') }}
                </a>
            </router-link>

            <router-link tag="li" replace exact
                v-if="isAdministrator"
                :to="routingUtility.buildPath('/users/' + user.id + '/authorization')">

                <a>
                    <i class="fa fa-key"></i>

                    {{ $t('users.authorization.authorization') }}
                </a>
            </router-link>
        </ul>

        <router-view
            v-if="user"
            :user="user"
            @userModified="userModified"></router-view>
    </div>
</template>

<script>
    import routingUtility from '@/utilities/shared/routing'
    import usersService from '@/services/users/users.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters, mapActions} from 'vuex'
    import PageHeader from '@/components/layout/PageHeader'
    import Loading from '@/components/shared/Loading'
    
    export default {
        components: {
            PageHeader,
            Loading
        },

        data () {
            return {
                routingUtility,

                breadcrumbs: [
                    {
                        title: this.$i18n.t('side-menu.users'),
                        url: '/users'
                    }
                ],

                user: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            isAdministrator () {
                return authService.hasClaim('CRITICAL_OPERATIONS')
            },

            isLoadingUser () {
                return this.loadings.indexOf('overview-fetching-user') >= 0
            },

            userName () {
                if (!this.user) {
                    return null
                }

                return this.user.name
            },

            pictureSource () {
                if (!this.user) {
                    return null
                }
                
                if (!this.user.picture) {
                    return routingUtility.buildPath('/static/assets/avatar.jpg')
                }

                if (this.user.picture.internal) {
                    return 'data:image/png;base64,' + this.user.picture.pictureInternal.data
                }

                return this.user.picture
            },

            activeTab () {
                return '/'
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            fetchUser () {
                var self = this

                self.loadingAdd('overview-fetching-user')

                usersService.getUser(this.$route.params.id).then((response) => {
                    self.user = response.data.data
                    self.loadingRemove('overview-fetching-user')
                })
            },

            userModified (user) {
                this.user = Object.assign({}, this.user, user)
            }
        },

        created () {
            this.fetchUser()
        }
    }
</script>