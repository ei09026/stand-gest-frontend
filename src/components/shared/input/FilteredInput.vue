<template>
    <input
        ref="input"
        :value="value"
        :placeholder="placeholder"
        @input="updateValue($event.target.value)"
        @focus="selectAll"
        @keypress.enter="$emit('key-pressed-enter')">
</template>

<script>
    export default {
        props: {
            value: null,

            filter: {
                type: Function,
                required: true
            },

            placeholder: String
        },

        methods: {
            updateValue (value) {
                var filteredValue = this.filter(value)

                this.$refs.input.value = filteredValue

                this.$emit('input', filteredValue)
            },

            selectAll (event) {
                // Workaround for Safari bug
                // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
                setTimeout(() => {
                    event.target.select()
                }, 0)
            }
        }
    }
</script>
