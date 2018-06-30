<template>
    <modal
            title="changePassword.modal.title"
            okText="general.change"
            cancelText="actions.cancel"
            :okButtonDisabled="!formValid"
            :show="changePassword.modalIsOpen"
            :busy="isBusy"
            :events="{ok: 'changePasswordOk', close: 'changePasswordClose', cancel: 'changePasswordCancel'}">

        <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <form class="form-horizontal">
                        <div class="col-lg-10">
                            <div class="form-group">
                                <label class="col-lg-5 control-label">
                                    {{$t('changePassword.currentPassword')}}
                                </label>
                                <div class="col-lg-7">
                                    <input type="password" class="form-control"
                                           v-model="fields.currentPassword"
                                           :placeholder="$t('changePassword.currentPassword')">
                                </div>
                            </div>
                            <div class="form-group" :class="{'has-warning': passwordMismatch}">
                                <label class="col-lg-5 control-label">
                                    {{$t('changePassword.newPassword')}}
                                </label>
                                <div class="col-lg-7">
                                    <input type="password" class="form-control"
                                           v-model="fields.newPassword"
                                           :placeholder="$t('changePassword.newPassword')">
                                </div>
                            </div>
                            <div class="form-group" :class="{'has-warning': passwordMismatch}">
                                <label class="col-lg-5 control-label">
                                    {{$t('changePassword.passwordConfirmation')}}
                                </label>
                                <div class="col-lg-7">
                                    <input type="password" class="form-control"
                                           v-model="fields.passwordConfirmation"
                                           :placeholder="$t('changePassword.passwordConfirmation')">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import eventHub from '@/services/shared/events.service'
    import {mapGetters, mapActions} from 'vuex'
    import Modal from '@/components/shared/ModalOld'
    import FilteredInput from '@/components/shared/input/FilteredInput'
    import authService from '@/services/shared/auth.service'
    import toastrService from '@/services/shared/toastr.service'

    export default {
        components: {
            Modal,
            FilteredInput
        },

        data () {
            return {
                fields: {
                    currentPassword: null,
                    newPassword: null,
                    passwordConfirmation: null
                },
                isBusy: false
            }
        },

        computed: {
            ...mapGetters([
                'changePassword'
            ]),

            passwordMismatch() {
                return (!!this.fields.newPassword || !!this.fields.passwordConfirmation) && (this.fields.newPassword != this.fields.passwordConfirmation)
            },

            formValid() {
                return !!this.fields.currentPassword && !!this.fields.newPassword && !!this.fields.passwordConfirmation && (this.fields.newPassword == this.fields.passwordConfirmation)
            }
        },

        methods: {
            ...mapActions([
                'closeChangePasswordModal'
            ]),

            clearFormData() {
                this.fields.currentPassword = null
                this.fields.newPassword = null
                this.fields.passwordConfirmation = null
            },

            doChangePassword () {
                var self = this

                self.isBusy = true

                let payload = {
                    fields: {
                        currentPassword: self.fields.currentPassword,
                        newPassword: self.fields.newPassword

                    }
                }

                authService.changePassword(payload).then((response) => {
                    if(response.passwordChanged) {
                        self.clearFormData()
                        self.closeChangePasswordModal()
                        toastrService.success(this.$i18n.t('changePassword.modal.title'), this.$i18n.t('changePassword.passwordChanged'))
                    } else {
                        toastrService.error(this.$i18n.t('general.error'), response.message)
                    }
                    self.isBusy = false
                })
            },

            changePasswordCloseHandler () {
                this.clearFormData()
                this.closeChangePasswordModal()
            },

            changePasswordOkHandler () {
                this.doChangePassword(self.fields)
            }
        },

        created () {
            eventHub.$on('changePasswordClose', this.changePasswordCloseHandler)
            eventHub.$on('changePasswordOk', this.changePasswordOkHandler)
        },

        beforeDestroy () {
            eventHub.$off('changePasswordClose', this.changePasswordCloseHandler)
            eventHub.$off('changePasswordOk', this.changePasswordOkHandler)
        }
    }
</script>