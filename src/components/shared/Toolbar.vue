<template>
    <div class="toolbar" :class="toolbarClass">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            toolbarClass: [Object, Array]
        }
    }
</script>

<style>
.toolbar {
    background-color: #fff;
    border-color: #e7eaec;
    border-image: none;
    border-style: solid solid none;
    border-width: 2px 0 0;
    color: inherit;
    margin-bottom: 10px;
    padding: 10px;
    min-height: 48px;
}
</style>
