<template>
    <div class="checkable-item"
        :class="finalItemClass"
        @click.prevent="toggleChecked">

        <i class="fa-fw m-r-xs"
            :class="finalCheckboxClass"></i>

        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: [Boolean, Array],
                required: true
            },

            // Required when binding to an array
            val: String,

            disabled: {
                type: Boolean,
                default: false
            },

            itemClass: {
                type: [Object, Array],
                default () {
                    return {}
                }
            },

            checkboxClass: {
                type: [Object, Array],
                default () {
                    return {}
                }
            },

            checkedIconClass: {
                type: String,
                default: 'far fa-check-square'
            },

            uncheckedIconClass: {
                type: String,
                default: 'far fa-square'
            }
        },

        data () {
            return {
                valueProxy: this.value
            }
        },

        computed: {
            isArray () {
                return Array.isArray(this.value)
            },

            isChecked () {
                if (this.isArray) {
                    return this.valueProxy.indexOf(this.val) >= 0
                }

                return this.valueProxy
            },

            finalItemClass () {
                return Object.assign({}, this.itemClass, {
                    'disabled': this.disabled
                })
            },

            finalCheckboxClass () {
                let checkboxClass = {}

                if (Array.isArray(this.checkboxClass)) {
                    for (let i = 0; i < this.checkboxClass.length; i++) {
                        checkboxClass[this.checkboxClass[i]] = true
                    }
                } else {
                    checkboxClass = this.checkboxClass
                }

                Object.assign(checkboxClass, {
                    [this.uncheckedIconClass]: !this.isChecked,
                    [this.checkedIconClass]: this.isChecked
                })

                return checkboxClass
            }
        },

        methods: {
            toggleChecked () {
                if (this.disabled) {
                    return
                }

                if (this.isArray) {
                    let index = this.valueProxy.indexOf(this.val)

                    if (this.isChecked) {
                        if (index >= 0) {
                            this.value.splice(index, 1)
                        }
                    } else {
                        if (index < 0) {
                            this.value.push(this.val)
                        }
                    }
                } else {
                    this.valueProxy = !this.valueProxy
                }

                this.$emit('input', this.valueProxy)
            }
        },

        watch: {
            value (newValue) {
                this.valueProxy = newValue
            }
        }
    }
</script>

<style>
    .checkable-all,
    .checkable-item {
        cursor: pointer;
    }

    .checkable-all.disabled,
    .checkable-item.disabled {
        cursor: not-allowed;
    }

    .checkable-item:hover:not(.disabled) {
        background-color: #fafafa;
    }

    .checkable-item.disabled {
        color: #888888;
    }
</style>
