<template>
    <div class="users-overview-details">
        <div class="row">
            <div class="col-xs-12">
                <maintenance
                    :show="showEditUserModal"
                    @saved="saved($event)"
                    @canceled="canceled"
                    :user-id="user.id"></maintenance>

                <toolbar
                    v-if="isAdministrator">

                    <div class="row">
                        <div class="col-xs-12 text-right">
                            <button class="btn btn-circle btn-outline m-l-sm"
                                :class="{
                                    'btn-danger': !user.blocked,
                                    'btn-success': user.blocked
                                }"
                                v-tooltip="{
                                    title: user.blocked
                                        ? $t('users.maintenance.unblock-user')
                                        : $t('users.maintenance.block-user')
                                }"
                                @click="toggleUserBlock">

                                <i class="fa fa-ban"></i>
                            </button>

                            <button class="btn btn-primary btn-circle btn-outline m-l-sm"
                                :class="{'disabled': user.blocked}"
                                v-tooltip="{title: $t('users.maintenance.edit-user')}"
                                @click="toggleEditMode">

                                <i class="fa fa-pencil-alt"></i>
                            </button>
                        </div>
                    </div>
                </toolbar>
            </div>
            
            <div class="col-xs-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-content">
                        <form class="form-horizontal"
                            v-if="user">

                            <div class="form-group">
                                <label class="col-lg-2 control-label"
                                    v-text="$i18n.t('users.general.name')"></label>

                                <div class="col-lg-10">
                                    <span class="form-control no-borders">
                                        <small
                                            v-text="user.name"></small>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-lg-2 control-label"
                                    v-text="$i18n.t('users.general.email')"></label>

                                <div class="col-lg-10">
                                    <span class="form-control no-borders">
                                        <small
                                            v-text="user.email"></small>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-lg-2 control-label"
                                    v-text="$i18n.tc('users.general.user',1)"></label>

                                <div class="col-lg-10">
                                    <span class="form-control no-borders">
                                        <small
                                            v-text="user.username">
                                        </small>
                                    </span>
                                </div>
                            </div>

                            <div class="form-group m-b-none"
                                v-show="user.blocked">

                                <div class="col-lg-10 col-lg-offset-2">
                                    <span class="badge badge-danger">
                                        <i class="fa fa-ban"></i>

                                        {{ $i18n.t('state.blocked') }}
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <button-bar
            v-if="isAdministrator">

            <button class="btn btn-circle btn-outline m-l-sm"
                v-if="isAdministrator"
                :class="{
                    'btn-danger': !user.blocked,
                    'btn-success': user.blocked
                }"
                v-tooltip="{
                    title: user.blocked
                        ? $t('users.maintenance.unblock-user')
                        : $t('users.maintenance.block-user')
                }"
                @click="toggleUserBlock">

                <i class="fas"
                    :class="{
                        'fa-ban': !user.blocked,
                        'fa-check': user.blocked
                    }"></i>
            </button>

            <button class="btn btn-primary btn-circle btn-outline m-l-sm"
                v-if="isAdministrator"
                :class="{'disabled': user.blocked}"
                v-tooltip="{title: $t('users.maintenance.edit-user')}"
                @click="toggleEditMode">

                <i class="fa fa-pencil-alt"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import usersService from '@/services/users/users.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters, mapActions} from 'vuex'
    import tooltip from '@/directives/tooltip'
    import Toolbar from '@/components/shared/Toolbar'
    import Maintenance from '@/components/users/Maintenance'
    import ButtonBar from '@/components/shared/ButtonBar'

    export default {
        directives: {
            tooltip
        },

        components: {
            Toolbar,
            Maintenance,
            ButtonBar
        },

        props: {
            user: {
                type: Object,
                required: true
            }
        },

        data () {
            return {
                showEditUserModal: false
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            isAdministrator () {
                return authService.hasClaim('CRITICAL_OPERATIONS')
            },

            metadata () {
                return JSON.parse(this.user.metadata)
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            saved (user) {
                this.showEditUserModal = false
                this.$emit('userModified', user)
            },

            canceled () {
                this.showEditUserModal = false
            },

            toggleUserBlock () {
                this.loadingAdd('toggling-blocked-user')

                let self = this

                let blocked = !self.user.blocked

                usersService.updateUser(self.user.id, {blocked}).then(response => {
                    if (response.data.status === 'success') {
                        self.user.blocked = blocked
                    }

                    self.loadingRemove('toggling-blocked-user')

                    self.$emit('userModified', self.user)
                })
            },

            toggleEditMode () {
                if (!this.user.blocked) {
                    this.showEditUserModal = true
                }
            }
        }
    }
</script>
