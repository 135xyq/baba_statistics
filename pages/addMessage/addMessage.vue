<template>
	<view>
		<u--form labelPosition="left" :model="dataInfo" :rules="rules" ref="uForm">
			<u-form-item label="性别" prop="type" borderBottom @click="showType = true; hideKeyboard()"
				ref="item1">
				<u--input v-model="dataInfo.type" disabled disabledColor="#ffffff" placeholder="请选择性别"
					border="none"></u--input>
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
		</u--form>
		<u-action-sheet :show="showType" :actions="actions" title="请选择题目类别" description="必须选择一项"
			@close="showType = false" @select="sexSelect">
		</u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataInfo: {
					type: '',
					trueNumber:'',
					errorNumber:''
				},
				rules:{
					
				},
				actiobs:[]
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>