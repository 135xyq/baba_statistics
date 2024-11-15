<template>
	<view class="container">
	</view>
</template

<script>
	import {formateDateHMS} from "@/utils/formateDate.js"
	export default {
		data() {
			return {
				loading: false,
				dataInfo: {
					content: '',
					time: new Date(),
          isShow: true
				},
			}
    },
    computed: {
      // 预览效果
      previewShow(){
        // 获取当前日期和目标日期
        const now = new Date();
        const target = new Date(this.dataInfo.time);
        
        // 计算时间差（以毫秒为单位）
        const timeDiff = target - now;
        
        // 如果时间差小于0，表示目标日期已经过去
        if (timeDiff < 0) {
          return "目标日期已过去";
        }
        
        // 计算天数、小时、分钟和秒数
        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        this.showDateText = `距离还有${days}天${hours}时${minutes}分`
      }
    },
		methods: {
      onChangeShow(e) {
        this.dataInfo.isShow = e.detail.value
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
      			const [hours, minutes, seconds] = this.dataInfo.useTime.split(':')
      			const useTime = (Number((hours * 3600)) + Number((minutes * 60)) + Number(seconds))
      			if (this.type === 'add') {
      				uniCloud.callFunction({
      					name: "problem_add",
      					data: {
      						openid: this.openId,
      						...this.dataInfo,
      						useTime: useTime,
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
      						useTime: useTime,
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

	.form-time {
		line-height: 36px;
	}
</style>