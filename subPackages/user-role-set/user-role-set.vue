<template>
  <view class="container">
    <view class="main">
      <!-- 角色选择 -->
      <view class="section">
        <view class="section__title">角色选择</view>
        <view class="section__content">
          <view class="role-select">
            <view v-for="role in roles" :key="role._id" class="role-item"
              :class="{ 'role-item--active': currentRole === role._id }" @click="handleRoleChange(role)">
              <text class="role-item__name">{{ role.roleName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 模块配置 -->
      <view class="section">
        <view class="section__title">模块显示设置</view>
        <view class="section__content">
          <view class="setting-item" v-for="(item, index) in currentRoleModuleConfig" :key="item.key">
            <text class="setting-item__label">{{ item.name }}</text>
            <u-switch v-model="item.show" activeColor="#d81e06" />
          </view>
        </view>
      </view>

      <!-- Tabbar配置 -->
      <view class="section">
        <view class="section__title">底部导航设置</view>
        <view class="section__content">
          <view class="setting-item" v-for="(item, index) in currentRoleTabbarConfig" :key="item.key">
            <text class="setting-item__label">{{ item.name }}</text>
            <u-switch v-model="item.show" activeColor="#d81e06" />
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-button" @click="handleSave" :class="{ 'save-button--disabled': isSaving }">
        <text class="save-button__text">{{ isSaving ? '保存中...' : '保存设置' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserRoleList,updateUserRole,userGetInfo } from '@/api/user'
export default {
  data() {
    return {
      // 当前角色
      currentRole: '',
      // 当前角色的功能列表
      currentRoleFunctionList: [],
      // 用户角色
      roles: [],
      // 模块配置
      moduleConfig: [
        { name: '拉屎分析', key: 'thing-month-chart', show: true },
        { name: '拉屎记录', key: 'thing-history', show: true },
        { name: '体重记录', key: 'weight-history', show: true },
        { name: '体重分析', key: 'weight-chart', show: true },
        { name: '做题分析', key: 'problemMonthChart', show: true },
        { name: '位置共享', key: 'map', show: true },
        { name: '想说的话', key: 'want-say', show: true },
        { name: '照片墙', key: 'photo-wall', show: true },
        { name: '相册', key: 'photo-album', show: true },
        { name: '计时器', key: 'timeCount', show: true },
        { name: '通知管理', key: 'noticePage', show: true },
        { name: '幸运转盘', key: 'lucky', show: true },
        { name: '年月总结', key: 'summarize', show: true },
        { name: '账号切换', key: 'change', show: true },
      ],
      // 底部导航配置
      tabbarConfig: [
        { name: '首页', key: 'index', show: true },
        { name: '盲盒', key: 'blind', show: true },
        { name: '做题记录', key: 'problem', show: true },
        { name: '消息', key: 'chat', show: true }
      ]
    }
  },
  computed: {
    currentRoleModuleConfig() {
      const temp = [...this.moduleConfig]
      for (const config of temp) {
        if (this.currentRoleFunctionList.includes(config.key)) {
          config.show = true
        } else {
          config.show = false
        }
      }
      return temp
    },
    currentRoleTabbarConfig() {
      const temp = [...this.tabbarConfig]
      for (const config of temp) {
        if (this.currentRoleFunctionList.includes(config.key)) {
          config.show = true
        } else {
          config.show = false
        }
      }
      return temp
    }
  },
  onLoad() {
    this.getUserRoleList()
  },
  methods: {
    /**
     * 获取用户角色列表 
     */
    getUserRoleList() {
      getUserRoleList().then(res => {
        this.roles = res
        for (let i = 0; i < res.length; i++) {
          if(!this.currentRole) {
            if (res[i].roleLevel === 0) {
            this.currentRole = res[i]._id
            this.currentRoleFunctionList = res[i].functionList
            break
          }
          }
          
        }
      })
    },
    /**
     * 处理角色切换
     * @param role  角色信息
     */
    handleRoleChange(role) {
      this.currentRole = role._id
      this.currentRoleFunctionList = role.functionList
    },

    /**
     * 保存设置
     */
    handleSave() {
      if (this.isSaving) return

      this.isSaving = true
      try {
        const functionList = []
        for (const config of this.moduleConfig) {
          if (config.show) {
            functionList.push(config.key)
          }
        }
        for (const config of this.tabbarConfig) {
          if (config.show) {
            functionList.push(config.key)
          }
        }

        updateUserRole({
          _id: this.currentRole,
          functionList
        }).then(res => {
          userGetInfo({ }).then(res => {
            this.$store.dispatch("userInfo/updateUserInfo", res);
          })
          this.getUserRoleList()
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
        })
      } catch (error) {
        uni.showToast({
          title: '保存失败',
          icon: 'error'
        })
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.main {
  padding: 30rpx;
}

.role-select {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
}

.role-item {
  padding: 16rpx 40rpx;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  transition: all 0.3s ease;

  &--active {
    background-color: #d81e06;

    .role-item__name {
      color: #ffffff;
    }
  }

  &__name {
    font-size: 28rpx;
    color: #666;
    transition: color 0.3s ease;
  }

  &:active {
    transform: scale(0.95);
  }
}

.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  &__content {
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      &__label {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.save-button {
  margin-top: 40rpx;
  padding: 24rpx;
  background: linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186));
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s ease;

  &--disabled {
    opacity: 0.7;
    pointer-events: none;
  }

  &__text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
