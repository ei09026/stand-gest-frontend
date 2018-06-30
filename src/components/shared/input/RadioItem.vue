<template>
    <div class="radio-item"
        :class="radioItemClass"
        @click="select">

        <i class="fa-fw"
            v-if="!button"
            :class="iconClass"></i>

        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            // Currently selected value / object in the parent instance (v-model)
            value: {
                type: null,
                required: true
            },

            // The value / object that this option selects
            val: {
                type: null,
                required: true
            },

            // When working with objects, this is needed to define the key to compare
            valKey: {
                type: String,
                required: false
            },

            button: {
                type: Boolean,
                default: false
            },

            disabled: Boolean
        },

        computed: {
            isChecked () {
                if (this.valKey) {
                    if (!this.value || !this.val) {
                        return false
                    }

                    return this.value[this.valKey] === this.val[this.valKey]
                }

                return this.value === this.val
            },

            radioItemClass () {
                if (!this.button) {
                    return null
                }

                return {
                    'btn btn-default': !this.isChecked,
                    'btn btn-primary': this.isChecked
                }
            },

            iconClass () {
                if (this.button) {
                    return null
                }

                return {
                    'far fa-circle': !this.isChecked,
                    'fas fa-circle': this.isChecked
                }
            }
        },

        methods: {
            select () {
                if (this.disabled) {
                    return
                }

                this.$emit('input', this.val)
            }
        }
    }
</script>

<style>
    .radio-item {
        cursor: pointer;
        display: inline-block;
    }

    .radio-item:not(.btn):hover {
        background-color: #fafafa;
    }
</style>
