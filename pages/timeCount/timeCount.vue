<template>
	<view class="stopwatch-container">
		<!-- 秒表显示部分 -->
		<view class="time-display">
			<text>{{ formatTime(hours) }} : {{ formatTime(minutes) }} : {{ formatTime(seconds) }}</text>
		</view>

		<!-- 控制按钮 -->
		<view class="buttons">
			<button  class="cancle"   @click="resetStopwatch">重置</button>
			<button @click="startStopwatch" v-if="!isRunning">开始</button>
			<button class="stop" @click="pauseStopwatch" v-if="isRunning">暂停</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				seconds: 0, // 秒
				minutes: 0, // 分
				hours: 0, // 时
				intervalId: null, // 用于保存定时器ID
				isRunning: false // 判断秒表是否在运行
			};
		},
		methods: {
			// 格式化时间，确保个位数时前面加 0
			formatTime(time) {
				return time < 10 ? '0' + time : time;
			},

			// 开始秒表
			startStopwatch() {
				if (!this.isRunning) {
					this.isRunning = true;
					this.intervalId = setInterval(() => {
						this.seconds++;
						if (this.seconds >= 60) {
							this.seconds = 0;
							this.minutes++;
						}
						if (this.minutes >= 60) {
							this.minutes = 0;
							this.hours++;
						}
					}, 1000); // 每秒更新一次
				}
			},

			// 暂停秒表
			pauseStopwatch() {
				if (this.isRunning) {
					clearInterval(this.intervalId);
					this.isRunning = false;
				}
			},

			// 重置秒表
			resetStopwatch() {
				clearInterval(this.intervalId);
				this.seconds = 0;
				this.minutes = 0;
				this.hours = 0;
				this.isRunning = false;
			}
		}
	};
</script>

<style scoped>
	.stopwatch-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.time-display {
		font-size: 48px;
		margin-bottom: 20px;
	}

	.buttons {
		display: flex;
		justify-content: center;
	}

	.buttons button {
		margin: 10px;
		padding: 5px 20px;
		font-size: 18px;
		border: none;
		border-radius: 5px;
		background-color: #42b983;
		color: white;
	}
	
	.buttons .cancle{
		background-color: #ccc;
	}
	.buttons .stop{
		background-color: #d81e06;
	}
</style>