<template>
	<view class="container">
		<uni-forms ref="baseForm" :modelValue="dataInfo" label-width="100">
			<uni-forms-item label="题目类型:" required>
				<uni-data-select v-model="dataInfo.type" :localdata="typeList"></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="做题数量:" required>
				<uni-number-box :min=0 :max="1000" v-model="dataInfo.totalNumber"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="错题数量:" required>
				<uni-number-box :min=0 :max="1000" v-model="dataInfo.errorNumber"></uni-number-box>
			</uni-forms-item>
		</uni-forms>
		<u-button text="新增记录" @click="onAdd" :disabled="loading"
			color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openId: '',
				loading: false,
				dataInfo: {
					type: '',
					totalNumber: 0,
					errorNumber: 0
				},
				typeList: [{
					text: '言语理解',
					value: 1
				}, {
					text: '资料分析',
					value: 2
				}, {
					text: '判断推理',
					value: 3
				}, {
					text: '数量关系',
					value: 4
				}, {
					text: '申论',
					value: 5
				}],
				rules: {
					type: {
						rules: [
							// 校验 name 不能为空
							{
								required: true,
								errorMessage: '请选择题目类型',
							}
						],
						// 当前表单域的字段中文名，可不填写
						label: '题目类型',
						validateTrigger: 'submit'
					}
				},
				actiobs: []
			}
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.baseForm.setRules(this.rules)
		},
		onShow() {
			if (this.$store.state.userInfo?.userInfo?.openid) {
				const state = this.$store.state.userInfo?.userInfo
				this.openId = state.openid

			} else {
				uni.switchTab({
					url: '/pages/login/login'
				})
			}
		},
		methods: {
			getText(value) {
				for (let key in this.typeList) {
					if(value  === this.typeList[key].value){
						return this.typeList[key].text
					}
				}
				return '未知类型'
			},
			onAdd() {
				if(this.loading) {
					this.loading = false
					return
				}
				this.$refs.baseForm.validate((err, formData) => {
					// 如果校验成功 ，err 返回 null
					if (!err) {
						uniCloud.callFunction({
						  name: "problem_add",
						  data: {
						    openid: this.openId,
							...this.dataInfo,
							typeName: this.getText(this.dataInfo.type)
						  },
						  success: (res) => {
							  uni.showToast({
							    title:'新增成功',
							    icon:'success'
							  })
						    setTimeout(()=>{
								uni.navigateBack()
							},1000)
						  }
						})
					}
					console.log('error', err)
				}).then(res => {
					// res 返回 null
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx 30rpx;
	}
</style>