<template>
	<view class="container">
		<uni-forms ref="baseForm" :rules="rules" :modelValue="dataInfo" label-width="100">
			<uni-forms-item label="题目类型:" name="type" required>
				<uni-data-select v-model="dataInfo.type" :localdata="typeList"></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="做题数量:" name="totalNumber" required>
				<uni-number-box :min=0 :max="1000" v-model="dataInfo.totalNumber"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="错题数量:" name="errorNumber" required>
				<uni-number-box :min=0 :max="1000" v-model="dataInfo.errorNumber"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="做题时间:"  required>
				<uni-datetime-picker returnType="timestamp" v-model="dataInfo.time" :clear-icon="false"/>
			</uni-forms-item>
		</uni-forms>
		<u-button :text="type==='add'? '新增记录' : '修改记录'" @click="onAdd" :disabled="loading"
			color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openId: '',
				loading: false,
				type: 'add',
				dataInfo: {
					type: '',
					totalNumber: 0,
					errorNumber: 0,
					time: new Date(),
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
					text: '常识判断',
					value: 5
				},{
					text: '申论',
					value: 6
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
					},
					totalNumber: {
						rules: [
							// 校验 name 不能为空
							{
								maximum: 999,
								minimum: 1,
								errorMessage: '做题数量不合法',
							}
						],
						// 当前表单域的字段中文名，可不填写
						label: '做题数量',
						validateTrigger: 'submit'
					},
					errorNumber: {
						rules: [
							// 校验 name 不能为空
							{
								maximum: 999,
								minimum: 0,
								errorMessage: '错题数量不合法',
							}
						],
						// 当前表单域的字段中文名，可不填写
						label: '错题数量',
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
		onLoad(query) {
			console.log(query.data);
			if(query.date){
				const now = new Date()
				const hour  = now.getHours()
				const  minutes = now.getMinutes()
				const seconds = now.getSeconds()
				const [year, month,day] = query.date.split('-')
				this.dataInfo.time = new Date(year, month -  1, day,hour,minutes,seconds)
			}
			if (query.data) {
				const problemData = JSON.parse(query.data)
				this.dataInfo = {
					type: problemData.type,
					totalNumber: problemData.totalNumber,
					errorNumber: problemData.errorNumber,
					time: problemData.time,
					_id: problemData._id
				}

				this.type = 'edit'
			} else {
				this.taInfo = {
					type: '',
					totalNumber: 0,
					errorNumber: 0
				}

				this.type = 'add'
			}
		},
		methods: {
			getText(value) {
				for (let key in this.typeList) {
					if (value === this.typeList[key].value) {
						return this.typeList[key].text
					}
				}
				return '未知类型'
			},
			onAdd() {
				if (this.loading) {
					this.loading = false
					return
				}
				this.$refs.baseForm.validate((err, formData) => {
					// 如果校验成功 ，err 返回 null
					if (!err) {
						if (this.dataInfo.errorNumber > this.dataInfo.totalNumber) {
							uni.showToast({
								title: '错题数量不合法？',
								icon: 'error'
							})
							return
						}
						if (this.type === 'add') {
							uniCloud.callFunction({
								name: "problem_add",
								data: {
									openid: this.openId,
									...this.dataInfo,
									typeName: this.getText(this.dataInfo.type)
								},
								success: (res) => {
									uni.showToast({
										title: '新增成功',
										icon: 'success'
									})
									setTimeout(() => {
										uni.navigateBack()
									}, 1000)
								}
							})
						} else {
							uniCloud.callFunction({
								name: "problem_edit",
								data: {
									...this.dataInfo,
									typeName: this.getText(this.dataInfo.type)
								},
								success: (res) => {
									uni.showToast({
										title: '修改成功',
										icon: 'success'
									})
									setTimeout(() => {
										uni.navigateBack()
									}, 1000)
								}
							})
						}
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