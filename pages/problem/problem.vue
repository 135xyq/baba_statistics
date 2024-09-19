<template>
	<view>
		<uni-calendar class="uni-calendar--hook" :selected="selected" @change="onChange" />
		<view>
			<uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
				@fabClick="onAddRecord"></uni-fab>
		</view>
	<view class="list">
			<uni-card v-for="(item,index) in dataList" :key="index" :title="item.typeName" :extra="formateTime(item.time)">
				<view class="list-body">
					<view class="list-body-item">
						<text class="list-body-item__label">答题数量：</text>
						<text class="list-body-item__value list-body-item__value--total">{{item.totalNumber}} </text>
					</view>
					<view class="list-body-item">
						<text class="list-body-item__label">错题数量：</text>
						<text class="list-body-item__value list-body-item__value--error">{{item.errorNumber}} </text>
					</view>
					<view class="list-body-item">
						<text class="list-body-item__label">正确率：</text>
						<text class="list-body-item__value list-body-item__value--rotate" :style="{color: ((item.totalNumber - item.errorNumber) / item.totalNumber * 100) <  70 ? '#fa3534':'#19be6b'}">{{item.totalNumber > 0 ?((item.totalNumber - item.errorNumber) / item.totalNumber * 100).toFixed(2) + '%' : (0 + '%')}} </text>
					</view>
					</view>
			</uni-card>

		</view>
	</view>
</template>

<script>
	import {
		formateDate
	} from "@/utils/formateDate.js"
	import formateTime from "@/utils/formateDate.js"
	export default {
		data() {
			return {
				selected: [],
				openId: '',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#d81e06',
					buttonColor: '#d81e06',
					iconColor: '#fff'
				},
				dataList: []
			}
		},
		onShow() {
			if (this.$store.state.userInfo?.userInfo?.openid) {
				const state = this.$store.state.userInfo?.userInfo
				this.openId = state.openid
				this.getDayList()
				const  date = formateDate(new Date().getTime())
				uniCloud.callFunction({
					name: "problem_get_day",
					data: {
						openid: this.openId,
						date: date
					},
					success: (res) => {
						console.log(res);
						this.dataList = res.result.data
					}
				})
			} else {
				uni.switchTab({
					url: '/pages/login/login'
				})
			}
		},

		methods: {
			formateTime,
			onAddRecord() {
				uni.navigateTo({
					url: '/pages/addProblem/addProblem'
				})
			},
			onChange(time) {
				console.log(time);
				uniCloud.callFunction({
					name: "problem_get_day",
					data: {
						openid: this.openId,
						date: time.fulldate
					},
					success: (res) => {
						console.log(res);
						this.dataList = res.result.data
					}
				})
			},
			// 获取当天的数据列表
			getDayList() {
				uniCloud.callFunction({
					name: "problem_get_month",
					data: {
						openid: this.openId
					},
					success: (res) => {
						const data = res.result.data
						for (let key in data) {
							const item = data[key]
							if (item.count !== 0) {
								let rotate = 0
								if (item.totalNumber > 0) {
									console.log(item);
									rotate = ((item.totalNumber - item.errorNumber) / item.totalNumber * 100)
										.toFixed(2)
								}
								this.selected.push({
									date: key,
									info: rotate + '%'
								})
							}
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.list {
		padding-bottom: 30rpx;
		&-body{
			&-item{
				&__label{
					font-weight: 600;

				}
				
				&__value{
					font-weight: 700;
					&--total{
						color: #2979ff;
					}
					
					&--error{
						color:#fa3534;
					}
					
					&--rotate{
						color: #19be6b;
					}
				}
			}
		}
	}
</style>