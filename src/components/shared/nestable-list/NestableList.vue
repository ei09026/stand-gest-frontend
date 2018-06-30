<template>
    <div class="dd nestable-list"
        v-nestable-list="{'options': finalOptions, 'collapsed': collapsed}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        directives: {
            nestableList: {
                bind (el, binding, vnode) {
                    /* eslint-disable */
                    let jEl = $(el)
                    /* eslint-enable */

                    jEl.nestable(
                        binding.value.options || this.defaultOptions
                    ).nestable(binding.value.collapsed ? 'collapseAll' : '').on('change', (event, item, source, destination) => {
                        vnode.context.changed(jEl.nestable('serialize'))
                    })
                },

                unbind (el) {
                    /* eslint-disable */
                    $(el).nestable('destroy')
                    /* eslint-enable */
                }
            }
        },

        props: {
            options: {
                required: false,
                type: Object
            },

            collapsed: {
                required: true,
                type: Boolean,
                default: false
            }
        },

        computed: {
            finalOptions () {
                return this.options || this.defaultOptions
            }
        },

        data () {
            return {
                structure: [],

                defaultOptions: {
                    handleClass: 'draggable',
                    maxDepth: 3
                }
            }
        },

        methods: {
            changed (structure) {
                this.$emit('change', structure)
            }
        }
    }
</script>

<style>
    .nestable-list .dd-item>button {
        font-family: Font Awesome\ 5 Free;
        height: 34px;
        width: 33px;
        color: #c1c1c1;
    }

    .nestable-list .dd-handle {
        color: inherit;
        border: 1px dashed #e7eaec;
        background: #f3f3f4;
        padding: 10px;
    }

    .nestable-list span.label {
        margin-right: 10px;
    }

    .nestable-list .dd-item > button[data-action="collapse"]:before {
        content: "\f068";
    }

    .nestable-list .dd-item > button:before {
        content: "\f067";
    }
</style>
