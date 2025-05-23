<template>
  <view class="modal-overlay" v-if="visible">
    <view class="modal-content">
      <view class="modal-header">
        <text>{{ title }}</text>
      </view>
      <view class="modal-body">
        <view class="modal-body-line" v-for="(line, index) in contentLines" :key="index">{{ line }}
        </view>
    
      </view>
      <view class="modal-footer">
          <u-button text="关闭" @click="closeModal"
            color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))" />
        </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    content: String
  },
  computed: {
    contentLines() {
      return this.content.split('\n');
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
}

.modal-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.modal-body {
  margin-bottom: 20px;

  &-line {
    font-size: 24rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
  }
  margin-bottom: 30rpx;
}

.modal-footer {
  text-align: right;

}
</style>