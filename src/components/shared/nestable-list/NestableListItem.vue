<template>
    <li class="dd-item" :data-id="id">
        <div class="dd-handle" :class="[{ draggable: draggable }, listItemClass]">
            <slot name="content"></slot>
        </div>
        <slot></slot>
    </li>
</template>

<script>
    export default {
        props: {
            id: {
                required: true
            },

            draggable: {
                type: Boolean,
                required: false,
                default: false
            },

            listItemClass: {
                type: String,
                required: false,
                default: null
            }
        }
    }
</script>

<style>
    .draggable-shadow {
        box-shadow: 1px 1px 1px grey;
    }

    .nestable-list .dd-handle {
        border: 1px solid #e7eaec;
    }
</style>
