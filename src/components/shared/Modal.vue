<template>
    <div
        v-show="isOpen">

        <div class="modal"
            @click.self="clickOutside">

            <div class="modal-dialog"
                :class="modalClass">

                <div class="modal-content animated"
                    v-if="isOpen"
                    :class="modalContentClass"
                    :style="modalContentStyle">

                    <!--Header-->
                    <div class="modal-header">
                        <slot name="header">
                            <a type="button" class="close"
                                @click="cancel">
                                <i class="fa fa-times"></i>
                            </a>

                            <h4 class="modal-title"
                                v-text="title"></h4>
                        </slot>
                    </div>

                    <!--Container-->
                    <div class="modal-body">
                        <slot></slot>
                    </div>

                    <!--Footer-->
                    <div class="modal-footer"
                        v-if="footer">

                        <slot name="footer">
                            <button type="button"
                                :class="cancelClass"
                                v-text="cancelText"
                                @click="cancel"></button>

                            <button type="button"
                                :disabled="okButtonDisabled || busy"
                                :class="okClass"
                                v-text="okText"
                                @click="ok">

                                <i class="fa fa-fw fa-cog fa-spin"
                                    v-show="busy"></i>
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-backdrop in"></div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },

            priority: {
                type: Number,
                default: 1
            },

            title: {
                type: String,
                default: ''
            },

            small: {
                type: Boolean,
                default: false
            },

            large: {
                type: Boolean,
                default: false
            },

            full: {
                type: Boolean,
                default: false
            },

            xl: {
                type: Boolean,
                default: false
            },

            xxl: {
                type: Boolean,
                default: false
            },

            openAnimation: {
                type: String,
                default: 'fadeInDown'
            },

            closeAnimation: {
                type: String,
                default: 'fadeOutUp'
            },

            openDuration: {
                type: Number,
                default: 400
            },

            closeDuration: {
                type: Number,
                default: 200
            },

            busy: {
                type: Boolean,
                default: false
            },

            force: {
                type: Boolean,
                default: false
            },

            closeWhenOk: {
                type: Boolean,
                default: false
            },

            footer: {
                type: Boolean,
                default: true
            },

            okText: {
                type: String,
                default () {
                    return this.$i18n.t('actions.ok')
                }
            },

            cancelText: {
                type: String,
                default () {
                    return this.$i18n.t('actions.cancel')
                }
            },

            okClass: {
                type: String,
                default: 'btn btn-w-m btn-success'
            },

            cancelClass: {
                type: String,
                default: 'btn btn-w-m btn-danger'
            },

            okButtonDisabled: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                animation: this.openAnimation,
                animationDuration: this.openDuration
            }
        },

        computed: {
            ...mapGetters([
                'openModal'
            ]),

            modalClass () {
                return {
                    'modal-lg': this.large,
                    'modal-sm': this.small,
                    'modal-full': this.full,
                    'modal-xl': this.xl,
                    'modal-xxl': this.xxl
                }
            },

            modalIdentifier () {
                return {
                    key: this._uid,
                    priority: this.priority
                }
            },

            isOpen () {
                return this.openModal && this.openModal.key === this.modalIdentifier.key
            },

            modalContentClass () {
                return [this.animation]
            },

            modalContentStyle () {
                return {
                    'animation-duration': (this.animationDuration / 1000) + 's'
                }
            }
        },

        methods: {
            ...mapActions([
                'modalOpen',
                'modalClose'
            ]),

            open () {
                if (this.isOpen) {
                    return
                }

                this.animation = this.openAnimation
                this.animationDuration = this.openDuration

                this.modalOpen(this.modalIdentifier)
                this.$emit('open')
            },

            close () {
                if (!this.isOpen) {
                    return
                }

                this.animation = this.closeAnimation
                this.animationDuration = this.closeDuration

                let timeOut = this.animationDuration >= 100 ? this.animationDuration - 50 : this.animationDuration

                let self = this

                window.setTimeout(() => {
                    self.modalClose(self.modalIdentifier)
                    self.animation = self.openAnimation
                    self.animationDuration = self.openDuration
                    self.$emit('close')
                }, timeOut)
            },

            ok () {
                this.$emit('ok')

                if (this.closeWhenOk) {
                    this.close()
                }
            },

            cancel () {
                this.$emit('cancel')
                this.close()
            },

            clickOutside () {
                if (!this.force) {
                    this.cancel()
                }
            },

            updateState (show) {
                if (show) {
                    this.open()
                } else {
                    this.close()
                }
            }
        },

        watch: {
            show (show) {
                this.updateState(show)
            }
        },

        created () {
            this.updateState(this.show)
        }
    }
</script>

<style>
    .modal {
        display: block;
    }

    @media (min-width: 768px) {
        .modal-xl {
            width: 70%;
            max-width: 1900px;
        }

        .modal-xxl {
            width: 90%;
            max-width: 1900px;
        }
    }
</style>
