<template>
    <div
        class="login-page"
        :style="{minHeight: pageContentSize.height + 'px'}">

        <loading
            v-show="isLoggingIn"></loading>

        <template
            v-if="!isLoggingIn">

            <h3 class="app-title"
                v-if="step === 1"
                v-text="config.app_name"></h3>

            <div class="middle-box text-center loginscreen animated fadeInDown">
                <div
                    v-if="step === 1">

                    <input 
                        class="form-control m-b" 
                        autocomplete="new-password"
                        ref="login"
                        :placeholder="$i18n.t('authentication.username')"
                        v-model="credentials.email"
                        @keyup.enter="submit()">

                    <input 
                        type="password" 
                        class="form-control m-b" 
                        autocomplete="new-password"
                        ref="password"
                        v-model="credentials.password"
                        :placeholder="$i18n.t('authentication.password')"
                        @keyup.enter="submit()">

                    <button 
                        type="button" 
                        class="btn btn-success block full-width"
                        @click="submit()"
                        :disabled="!isValid || isLoadingPreflight">

                        {{ $i18n.t('authentication.login') }}

                        <i class="fa fa-fw fa-angle-right"
                            v-show="!isLoadingPreflight"></i>

                        <i class="fa fa-fw fa-cog fa-spin"
                            v-show="isLoadingPreflight"></i>
                    </button>
                </div>

                <div
                    v-if="step === 3">

                    <img alt="image" class="img-circle circle-border"
                        :src="pictureSource">

                    <h3 class="m-t m-b"
                        v-text="name"></h3>

                    <div class="alert alert-info p-sm">
                        {{ $i18n.t('authentication.your-password-must-be-changed') }}
                    </div>

                    <div class="form-group m-t-lg m-b-lg"
                        :class="{'has-error': newPasswordValidationError}">

                        <label class="new-password-label"
                            v-text="$i18n.t('authentication.new-password')"></label>

                        <input class="form-control" autocomplete="new-password"
                            type="password"
                            placeholder="Introduza nova password"
                            v-model="newPassword"
                            ref="newPassword">

                        <span class="help-block text-left"
                            v-show="newPasswordValidationError"
                            v-text="newPasswordValidationError">
                        </span>
                    </div>

                    <div class="form-group m-b-lg"
                        :class="{'has-error': !isValidPasswordConfirm}">

                        <label class="new-password-label"
                            v-text="$i18n.t('authentication.confirm-password')"></label>

                        <input class="form-control" autocomplete="new-password"
                            type="password"
                            placeholder="Reintroduza a nova password"
                            v-model="newPasswordConfirm"
                            @keyup.enter="redefinePassword()">

                        <span class="help-block text-left"
                            v-show="!isValidPasswordConfirm"
                            v-text="$i18n.t('authentication.passwords-do-not-match')">
                        </span>
                    </div>

                    <button type="button" class="btn btn-success block full-width"
                        @click="redefinePassword()"
                        :disabled="newPasswordValidationError || isRedefiningPassword">

                        {{ $i18n.t('actions.ok') }}

                        <i class="fa fa-fw fa-cog fa-spin"
                            v-show="isRedefiningPassword"></i>
                    </button>
                </div>
            </div>

            <p class="licensed-to">
                <small>{{ $i18n.t('general.licensed-to')}}</small>

                <img
                    :src="buildPath('/static/assets/licensed-to-logo.png')">
            </p>

            <p class="powered-by">
                <small>Copyright © {{ currentYear }}</small>
            </p>
        </template>
    </div>
</template>

<script>
    import moment from 'moment'
    import config from '@/configs/app.config'
    import routingUtility from '@/utilities/shared/routing'
    import authService from '@/services/shared/auth.service'
    import toastrService from '@/services/shared/toastr.service'
    import {mapGetters, mapActions} from 'vuex'
    import Loading from '@/components/shared/Loading'

    export default {
        components: {
            Loading
        },

        data () {
            return {
                config,

                step: 1,

                credentials: {
                    email: '',
                    password: ''
                },

                error: null,

                name: '',

                picture: {
                    isInternal: false,
                    data: ''
                },

                revokePassword: false,

                newPassword: null,

                newPasswordConfirm: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            currentYear () {
                return moment().format('YYYY')
            },

            pictureSource (picture) {
                let source = this.picture.data

                if (this.picture.isInternal) {
                    source = 'data:image/png;base64,' + source
                }

                return source
            },

            isLoggingIn () {
                return this.loadings.indexOf('loggingIn') !== -1
            },

            isLoadingPreflight () {
                return this.loadings.indexOf('loadingPreflight') !== -1
            },

            isRedefiningPassword () {
                return this.loadings.indexOf('redefiningPassword') !== -1
            },

            isValid () {
                if (this.step === 1) {
                    return !!this.credentials.email && 
                        !!this.credentials.password
                }

                if (this.step === 3) {
                    return true
                }

                return false
            },

            newPasswordValidationError () {
                if (!this.newPassword || this.newPassword.length < 5) {
                    return this.$i18n.t('authentication.password-must-have-at-least-5-characters')
                }

                if (this.newPassword === this.credentials.password) {
                    return this.$i18n.t('authentication.new-password-must-be-different-than-old-one')
                }

                return null
            },

            isValidPasswordConfirm () {
                return this.newPasswordConfirm === this.newPassword
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            ...routingUtility,

            submit () {
                var self = this

                if (self.isLoggingIn || !self.isValid) {
                    return
                }

                self.loadingAdd('loggingIn')

                authService.login(self.credentials).then(response => { 
                    if(response.data.status === "fail") {
                        toastrService.error(self.$i18n.t('general.error'), response.data.error.message, {positionClass: 'login-toast-top-right'})
                    } else {
                        toastrService.success('', self.$i18n.t('general.welcome') + "Nelson" + '.')
                        localStorage.setItem('token', response.data.data)
                        self.$router.push('/')
                    }

                    /*if (self.revokePassword) {
                        self.step = 3
                    } else {
                        self.$router.push('/')

                        toastrService.success('', self.$i18n.t('general.welcome') + user.name + '.')
                    }*/ 
                }).catch((error) => {                    
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        self.$i18n.t('authentication.invalid-authentication'),
                        {positionClass: 'login-toast-top-right'})
                }).finally(() => {
                    self.loadingRemove('loggingIn')
                })
            

                /*authService.login({
                    email: self.credentials.email,
                    password: self.credentials.password
                }).then(user => {
                    if (self.revokePassword) {
                        self.step = 3
                    } else {
                        self.$router.push('/')

                        toastrService.success('', self.$i18n.t('general.welcome') + user.name + '.')
                    }
                }).catch(() => {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        self.$i18n.t('authentication.invalid-authentication'),
                        {positionClass: 'login-toast-top-right'})
                }).then(() => {
                    self.loadingRemove('loggingIn')
                })*/
            },

            redefinePassword () {
                let self = this

                if (self.newPasswordValidationError || self.isRedefiningPassword) {
                    return
                }

                self.loadingAdd('redefiningPassword')

                let data = {
                    fields: {
                        currentPassword: self.credentials.password,
                        newPassword: self.newPassword
                    }
                }

                authService.changePassword(data).then(response => {
                    if (response.hasOwnProperty('status') && response.status === 'fail') {
                        toastrService.error(
                            self.$i18n.t('general.error'),
                            response.message,
                            {positionClass: 'login-toast-top-right'})
                    } else {
                        self.loadingRemove('redefiningPassword')

                        self.credentials.password = self.newPassword

                        self.revokePassword = false

                        self.submit()
                    }

                    self.loadingRemove('redefiningPassword')
                })
            },        

            autoFocus () {
                this.$nextTick(() => {
                    if (this.step === 1 && this.$refs.login) {
                        this.$refs.login.focus()
                    }                    

                    if (this.step === 3 && this.$refs.newPassword) {
                        this.$refs.newPassword.focus()
                    }
                })
            },

            buildPath (path) {
                return routingUtility.buildPath(path)
            }
        },

        watch: {
            isLoggingIn () {
                if (!this.isLoggingIn) {
                    this.autoFocus()
                }
            },

            step () {
                if (!this.isLoggingIn) {
                    this.autoFocus()
                }
            }
        },

        mounted () {
            this.autoFocus()
        }
    }
</script>

<style>
    .login-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }

    .login-page .app-title {
        font-size: 85px;
        font-weight: 100;
        font-family: 'Lato', sans-serif;
    }

    .login-page .middle-box.loginscreen {
        margin-top: 0px;
        padding-top: 0px;
    }

    .login-page .licensed-to {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login-page .powered-by img {
        height: 26px;
    }

    .login-toast-top-right {
        top: 12px;
        right: 12px;
    }
</style>