<template>
  <view class="set-container">
    <view class="set-card">
      <view class="item" @click="onHandleSetAvatar">
        <view class="item-title">
          <text class="item-title-text">头像</text>
        </view>
        <view class="item-value">
          <view class="avatar-wrapper">
            <u-avatar :src="userInfo.avatar" size="80" />
            <view class="avatar-edit-icon">
              <u-icon name="camera-fill" size="20" color="#ffffff" />
            </view>
          </view>
        </view>
      </view>
      <view class="item">
        <view class="item-title">
          <text class="item-title-text">昵称</text>
        </view>
        <view class="item-value">
          <u--input
            placeholder="请输入名字"
            maxlength="10"
            v-model="userInfo.nickName"
            border="bottom"
            clearable
          />
        </view>
      </view>
      <view class="item">
        <view class="item-title">
          <text class="item-title-text">性别</text>
        </view>
        <view class="item-value">
          <u-radio-group
            v-model="userInfo.gender"
            placement="column"
            iconPlacement="right"
            :borderBottom="true"
          >
            <u-radio
              activeColor="#d81e06"
              :customStyle="{ padding: '20px' }"
              label="男"
              :name="1"
            />
            <u-radio
              activeColor="#d81e06"
              :customStyle="{ padding: '20px' }"
              label="女"
              :name="2"
            />
          </u-radio-group>
        </view>
      </view>
    </view>
    
    <view class="button-container">
      <u-button
        :loading="loading"
        :disabled="loading"
        type="primary"
        text="保存修改"
        @click="onHandleSet"
        :customStyle="{
          width: '100%',
          height: '88rpx',
          borderRadius: '44rpx',
          background: loading ? '#d81e06' : '#d81e06'
        }"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.set-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30rpx;
}

.set-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.item {
  padding: 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f8f9fa;
  }

  &-title {
    min-width: 150rpx;

    &-text {
      font-size: 32rpx;
      color: #333333;
      font-weight: 500;
    }
  }

  &-value {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}

.avatar-wrapper {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  .avatar-edit-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

::v-deep .u-radio-group--column {
  flex-direction: row;
  gap: 60rpx;

  .u-radio {
    margin: 0;
    padding: 20rpx 0;

    &__text {
      font-size: 28rpx;
      color: #666666;
    }
  }
}

::v-deep .u--input {
  flex: 1;
  margin-left: 20rpx;

  .u-input__input {
    font-size: 28rpx;
    text-align: right;
  }
}

.button-container {
  margin-top: 60rpx;
  padding: 0 30rpx;
}
</style>

<script>
import { userGetInfo, userSetInfo } from "@/api/user";

export default {
  data() {
    return {
      // 用户信息
      userInfo: {
        avatar: "",
        nickName: "",
        gender: "",
      },
      loading: false,
      isUploadImg: false,
    };
  },
  created() {
    if (this.$store.state.userInfo?.userInfo?.openid) {
      const state = this.$store.state.userInfo?.userInfo;
      this.userInfo.avatar = state.avatarUrl;
      this.userInfo.nickName = state.nickName;
      this.userInfo.gender = state.gender;
    }
  },
  methods: {
    //  修改
    async onHandleSet() {
      if (!this.userInfo.nickName.trim()) {
        uni.showToast({
          title: "昵称不能为空",
          icon: "none",
        });
        return;
      }
      this.loading = true;

      uni.showLoading();
      const self = this;
      let img;
      if (this.isUploadImg) {
        img = await this.getFileId();
      }

      userSetInfo({
        nickName: this.userInfo.nickName,
        avatarUrl: img,
        gender: this.userInfo.gender,
      })
        .then(() => {
          uni.showToast({
            title: "更新成功",
            icon: "success",
          });
          userGetInfo().then((res) => {
            self.$store.dispatch("userInfo/updateUserInfo", res);
            uni.switchTab({
              url: "/pages/login/login",
            });
          });
        })
        .finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
    },
    /**
     * 修改头像
     */
    async onHandleSetAvatar() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
          this.isUploadImg = true;
        },
      });
    },
    /**
     * 获取所有的id结果
     * @returns {Promise<unknown>}
     */
    getFileId() {
      return new Promise(async (resolve) => {
        const extension = this.userInfo.avatar.substring(this.userInfo.avatar.lastIndexOf('.'));
        const result = await uniCloud.uploadFile({
          filePath: this.userInfo.avatar,
          cloudPath: `${new Date().getTime()}-${Math.random().toString(36).slice(2)}${extension}`,
        });
        resolve(result.fileID);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.button-container {
  margin-top: 30px;
  padding: 0 30rpx;
}

.item {
  margin: 0 30rpx;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-title {
    min-width: 150rpx;
  }

  &-value {
    display: flex;
  }

  ::v-deep .u-radio-group--column {
    flex-direction: row;

    .u-radio__text {
      padding-right: 10rpx;
    }
  }
}
</style>
