<template>
    <ol class="dd-list">
        <slot></slot>
    </ol>
</template>

<script>
    export default {
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
