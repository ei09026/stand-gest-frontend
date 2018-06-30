<template>
    <modal
        :show="show"
        :title="title"
        :large="true"
        :footer="true"
        :ok-text="$i18n.t('actions.save')"
        :ok-button-disabled="!isValid"
        @ok="save"
        @cancel="cancel">

        <loading
            v-show="!isReady"></loading>

        <template
            v-if="isReady">

            <div class="row">
                <template
                    v-if="canEditPersonalData">

                    <div class="col-lg-8 col-lg-offset-2">
                        <div class="form-group">
                            <label
                                v-text="$i18n.t('users.general.name')"></label>

                            <input class="form-control"
                                v-model="user.name">
                        </div>
                    </div>

                    <div class="col-lg-8 col-lg-offset-2">
                        <div class="form-group"
                            :class="{'has-error': !isValidEmail}">

                            <label
                                v-text="$i18n.t('users.general.email')"></label>

                            <input class="form-control" type="email"
                                v-model="user.email">

                            <span class="help-block"
                                v-show="!isValidEmail"
                                v-text="$i18n.t('users.maintenance.invalid-email-address')"></span>
                        </div>
                    </div>
                </template>

                <div class="col-lg-8 col-lg-offset-2"
                    v-if="createMode">

                    <div class="form-group"
                        :class="{'has-error': !isValidUsername}">

                        <label
                            v-text="$i18n.tc('users.general.user',1)"></label>

                        <input class="form-control"
                            v-model="user.username">

                        <span class="help-block"
                            v-show="!isValidUsername"
                            v-text="$i18n.t('users.maintenance.username-must-have-at-least-5-characters')">
                        </span>
                    </div>
                </div>

                <template
                    v-if="canEditPassword">

                    <div class="col-lg-8 col-lg-offset-2 m-b-md"
                        v-if="editMode">

                        <check-item
                            v-model="changePassword"
                            @input="clearPasswordFields">

                            {{ $i18n.t('users.maintenance.change-password') }}
                        </check-item>
                    </div>

                    <template
                        v-if="changingPassword">

                        <div class="col-lg-8 col-lg-offset-2">
                            <div class="form-group"
                                :class="{'has-error': !isValidPassword}">

                                <label
                                    v-if="createMode"
                                    v-text="$i18n.t('users.general.password')"></label>

                                <label
                                    v-if="editMode"
                                    v-text="$i18n.t('users.maintenance.new-password')"></label>

                                <input type="password" class="form-control"
                                    v-model="password">

                                <span class="help-block"
                                    v-show="!isValidPassword"
                                    v-text="$i18n.t('users.maintenance.password-must-have-at-least-5-characters')">
                                </span>
                            </div>
                        </div>

                        <div class="col-lg-8 col-lg-offset-2">
                            <div class="form-group m-b-none"
                                :class="{'has-error': !isValidPasswordConfirm}">

                                <label
                                    v-text="$i18n.t('users.maintenance.confirm-password')"></label>

                                <input type="password" class="form-control"
                                    v-model="passwordConfirm">

                                <span class="help-block"
                                    v-show="!isValidPasswordConfirm"
                                    v-text="$i18n.t('users.maintenance.passwords-do-not-match')">
                                </span>
                            </div>
                        </div>
                    </template>
                </template>

                <div class="col-lg-8 col-lg-offset-2"
                    v-if="canRevokePassword"
                    :class="{'m-t-sm': changingPassword}">

                    <check-item
                        v-model="user.revokePassword">

                        {{ $i18n.t('users.maintenance.change-password-on-next-login') }}
                    </check-item>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
    import _ from 'lodash'
    import toastrService from '@/services/shared/toastr.service'
    import validationService from '@/services/shared/validation.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters, mapActions} from 'vuex'
    import Loading from '@/components/shared/Loading'
    import Modal from '@/components/shared/Modal'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import tenantsService from '@/services/tenants/tenants.service'
    import usersService from '@/services/users/users.service'

    export default {
        components: {
            Loading,
            Modal,
            CheckItem
        },

        data () {
            return {
                authService,

                user: null,
                password: '',
                passwordConfirm: '',

                changePassword: false
            }
        },

        props: {
            show: {
                type: Boolean,
                default: false
            },

            userId: null,

            tenants: {
                type: Array
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            isAdministrator () {
                return authService.hasClaim('CRITICAL_OPERATIONS')
            },

            isLoading () {
                return this.loadings.indexOf('maintenance-fetching-user') !== -1
            },

            editMode () {
                return !!this.userId
            },

            createMode () {
                return !this.userId
            },

            canEditPersonalData () {
                return this.createMode || this.isAdministrator
                    // authService.hasClaim('BO_USERS_EDIT_PERSONAL_DATA')
            },

            canEditPassword () {
                return this.createMode || this.isAdministrator
                    // authService.hasClaim('BO_USERS_EDIT_PASSWORD')
            },

            canRevokePassword () {
                return this.createMode || this.isAdministrator
                    // authService.hasClaim('BO_USERS_EDIT_PASSWORD')
            },

            isReady () {
                if (!this.user) {
                    return false
                }

                return !this.isLoading
            },

            isValidEmail () {
                // TODO: check availability
                return this.user && validationService.email(this.user.email)
            },

            isValidUsername () {
                // TODO: check availability
                return this.user && this.user.username && this.user.username.length >= 5
            },

            isValidPassword () {
                return !this.changingPassword || this.password.length >= 5
            },

            isValidPasswordConfirm () {
                return this.passwordConfirm === this.password
            },

            isValid () {
                return this.user &&
                    this.user.name &&
                    this.isValidEmail &&
                    this.isValidUsername &&
                    this.isValidPassword &&
                    this.isValidPasswordConfirm
            },

            title () {
                return this.editMode
                    ? this.$i18n.t('users.maintenance.edit-user')
                    : this.$i18n.t('users.maintenance.new-user')
            },

            changingPassword () {
                return this.createMode || this.changePassword
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            clearPasswordFields () {
                this.password = ''
                this.passwordConfirm = ''
            },

            setEmptyUser () {
                this.user = {
                    externalId: '',
                    name: '',
                    email: '',
                    username: '',
                    revokePassword: true
                }

                this.clearPasswordFields()
            },

            fetchUser () {
                let self = this

                self.loadingAdd('maintenance-fetching-user')

                var data = {
                    filter: {
                        ids: [this.userId]
                    },
                    pagination: null,
                    orderBy: null,
                    relations: ['username']
                }

                return usersService.retrieve(data).then(response => {
                    if (response.data.status === 'success' && response.data.data.results.length) {
                        let user = response.data.data.results[0]

                        user.revokePassword = !!user.revokePassword // False if null

                        self.user = user

                        self.loadingRemove('maintenance-fetching-user')
                    }
                })
            },

            initialize () {
                if (this.editMode) {
                    this.fetchUser()
                } else {
                    this.setEmptyUser()
                }
            },

            save () {
                let data = {
                    name: this.user.name,
                    email: this.user.email,
                    revokePassword: this.user.revokePassword
                }

                if (this.createMode) {
                    Object.assign(data, {
                        username: this.user.username,
                        tenantIds: (this.tenants && this.tenants.length) ? [this.tenants[0].id] : null
                    })
                }

                // changingPassword works for both create and edit modes
                if (this.changingPassword) {
                    Object.assign(data, {password: this.password})
                }

                let promise

                let self = this

                if (self.editMode) {
                    promise = usersService.updateUser(self.userId, data)
                } else {
                    promise = usersService.createUser(data)
                }

                return promise.then(response => {
                    if (self.createMode) {
                        if (response.data.status === 'success') {
                            Object.assign(self.user, {
                                id: response.data.data.id,
                                externalId: response.data.data.externalId
                            })

                            let parameters = {
                                data: {
                                    externalId: self.user.externalId
                                }
                            }

                            return usersService.backend.create(parameters).then(response => {
                                return response
                            })
                        } else {
                            toastrService.error(self.$t('general.error'), response.data.message)
                            return response
                        }
                    } else {
                        return response
                    }
                }).then(response => {
                    if (response.data.status === 'success') {
                        self.$emit('saved', self.user)
                    }
                })
            },

            cancel () {
                this.$emit('canceled')
            }
        },

        watch: {
            show (show) {
                if (show) {
                    this.initialize()
                }
            }
        },

        created () {
            if (this.show) {
                this.initialize()
            }
        }
    }
</script>
