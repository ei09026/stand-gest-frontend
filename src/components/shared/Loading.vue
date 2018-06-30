<template>
    <div class="spinner"
        v-once
        :style="spinnerStyle"></div>
</template>

<script>
    export default {
        props: {
            color: {
                type: String,
                default: '#3fb0a6'
            },

            borderSize: {
                type: Number,
                default: 1
            },

            height: {
                type: Number,
                default: 240
            }
        },

        computed: {
            spinnerStyle () {
                return {
                    backgroundColor: this.color,
                    margin: ((this.height - 40) / 2) + 'px auto'
                }
            }
        }
    }
</script>

<style>
    .spinner {
        width: 40px;
        height: 40px;
        margin: 100px auto;
        background-color: #333;

        border-radius: 100%;
        -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
        animation: sk-scaleout 1.0s infinite ease-in-out;
    }

    @-webkit-keyframes sk-scaleout {
        0% {
            -webkit-transform: scale(0)
        }
        100% {
            -webkit-transform: scale(1.0);
            opacity: 0;
        }
    }

    @keyframes sk-scaleout {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        100% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
            opacity: 0;
        }
    }
</style>
