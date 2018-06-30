<template>
	<div class="idt-button-bar text-center"
		:class="{'side-bar-margin': pageHasSideMenu}">

		<slot></slot>
	</div>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'

    export default {
        props: {
            fullBar: {
                type: Boolean,
                default: true
            }
		},

		computed: {
			...mapGetters([
				'pageHasSideMenu'
			])
		},

		methods: {
			...mapActions([
				'addButtonBar',
				'removeButtonBar'
			])
		},

		created () {
			this.addButtonBar(this._uid)
		},

		beforeDestroy () {
			this.removeButtonBar(this._uid)
		}
    }
</script>

<style>
	.idt-button-bar {
		height: 50px;
		left: 0;
		right: 0;
		position: fixed;
		bottom: 40px;
		z-index: 1000;
		padding: 10px;
		background-color: rgba(255, 255, 255, .7);
		border-top: 1px solid #e7eaec;
	}

	.idt-button-bar.side-bar-margin {
		margin-left: 220px;
	}
</style>
