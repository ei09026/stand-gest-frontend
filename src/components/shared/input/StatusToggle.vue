<template>
    <button class="btn" :class="finalButtonClass" @click="toggleStatus">
    
        <i class="fa fa-fw m-r-xs" :class="finalIconClass"></i>
    
        {{ buttonLabel }}
    </button>
</template>

<script>
    export default {
        props: {
            value: {
                type: Boolean,
                required: true
            },

            loading: {
                type: Boolean,
                default: false
            },

            disabled: {
                type: Boolean,
                default: false
            },

            buttonClass: {
                type: [Object, Array],
                default () {
                    return {}
                }
            },

            labelActive: String,
            labelInactive: String,

            callback: {
                type: Function,
                default () {
                    return () => { }
                }
            }
        },

        data () {
            return {
                status: this.value
            }
        },

        computed: {
            finalButtonClass () {
                let finalButtonClass = {
                    'disabled': this.disabled || this.loading
                }

                if (this.loading) {
                    Object.assign(finalButtonClass, {
                        'btn-warning': true
                    })
                } else {
                    Object.assign(finalButtonClass, {
                        'btn-success': this.status,
                        'btn-danger': !this.status
                    })
                }

                if (Array.isArray(this.buttonClass)) {
                    for (let i = 0; i < this.buttonClass.length; i++) {
                        finalButtonClass[this.listClass[i]] = true
                    }
                } else {
                    Object.assign(finalButtonClass, this.listClass)
                }

                return finalButtonClass
            },

            finalIconClass () {
                if (this.loading) {
                    return ['fa-cog fa-spin']
                }

                return {
                    'fa-check': this.status,
                    'fa-times': !this.status
                }
            },

            buttonLabel () {
                if (this.loading) {
                    return this.$i18n.t('general.loading')
                }

                let labelActive = this.labelActive || this.$i18n.tc('general.active', 1)
                let labelInactive = this.labelInactive || this.$i18n.tc('general.inactive', 1)

                return this.status ? labelActive : labelInactive
            }
        },

        methods: {
            toggleStatus () {
                if (this.loading || this.disabled) {
                    return
                }

                this.status = !this.status

                this.$emit('input', this.status)
                this.$emit('change', this.status)
            }
        }
    }
</script>
