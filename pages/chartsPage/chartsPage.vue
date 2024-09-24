<template>
	<view class="charts-box">
		<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
	</view>
</template>

<script>
	const colorList = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"]
	export default {
		data() {
			return {
				openId:'',
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: [colorList[Math.floor(Math.random() * colorList.length)]],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true,
						rotateLabel: true
					},
					yAxis: {
						showTitle: true,
						splitNumber: 3,
						disableGrid: true,
						data: [{
							min: 0,
							max: 3,
							title: '拉屎次数'
						}]
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					},
					legend: {
						show: false
					}
				}
			};
		},
		    onShow() {
		      if (this.$store.state.userInfo?.userInfo?.openid) {
		        const state = this.$store.state.userInfo?.userInfo
		        this.openId = state.openid
		      }else{
		        uni.navigateBack()
		      }
		    },
		onReady() {
			this.getData()

		},
		methods: {
			async getData() {
				await uniCloud.callFunction({
					name: "get_thing_week_chart",
					data: {
						openid: this.openId
					},
					success: (res) => {
						console.log(res);
						const data = res.result.data
						const value = Object.values(data)
						const max = Math.max(...value)
						const min = Math.min(...value)
						this.chartData = {
							categories: Object.keys(data),
							series: [{
								name: '拉屎次数',
								data: value
							}]
						}

						this.opts.yAxis.splitNumber = max
						this.opts.yAxis.data[0].max = max

						console.log(max, this.chartData);
					}
				})
			},
		}
	};
</script>

<style scoped>
	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 100%;
		height: 300px;
		margin-left: 15rpx;
	}
</style>