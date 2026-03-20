<template>
  <view class="role-management">
    <!-- 顶部搜索和操作栏 -->
    <view class="header-section">
      <view class="search-bar">
        <input
          class="search-input"
          type="text"
          placeholder="搜索角色名称或描述"
          v-model="searchKeyword"
          @input="handleSearch"
        />
        <text class="search-icon">🔍</text>
      </view>
      <button
        class="add-btn"
        @tap="showAddRole"
      >
        <text class="add-icon">+</text>
        <text>新增角色</text>
      </button>
    </view>

    <!-- 角色列表 -->
    <view class="role-list">
      <view
        v-for="role in filteredRoles"
        :key="role._id"
        class="role-item"
        :class="{ disabled: !role.status }"
      >
        <view class="role-info">
          <view class="role-header">
            <text class="role-name">{{ role.roleName }}</text>
            <view
              class="role-status"
              :class="{ active: role.status }"
            >
              {{ role.status ? "启用" : "禁用" }}
            </view>
          </view>
          <text class="role-description">{{ role.description || "暂无描述" }}</text>
          <view class="role-meta">
            <view class="meta-item">权限数量: {{ role.functionList.length }}</view>
            <view class="meta-item">创建时间: {{ formatDate(role.time) }}</view>
          </view>
        </view>
        <view class="role-actions">
          <button
            class="action-btn edit-btn"
            @tap="editRole(role)"
          >
            编辑
          </button>
          <button
            class="action-btn delete-btn"
            @tap="deleteRole(role)"
          >
            删除
          </button>

          <button
            v-if="systemConfig.newUserDefaultRole !== role._id"
            class="action-btn default-btn"
            @tap="setDefaultRole(role)"
          >
            设为默认
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view
      class="empty-state"
      v-if="filteredRoles.length === 0"
    >
      <text class="empty-icon">👥</text>
      <text class="empty-text">暂无角色数据</text>
      <button
        class="empty-btn"
        @tap="showAddRole"
      >
        立即添加
      </button>
    </view>

    <!-- 角色编辑弹窗 -->
    <view
      class="modal-overlay"
      v-if="showModal"
      @tap="closeModal"
    >
      <view
        class="modal-content"
        @tap.stop
      >
        <view class="modal-header">
          <text class="modal-title">{{ isEdit ? "编辑角色" : "新增角色" }}</text>
          <text
            class="modal-close"
            @tap="closeModal"
          >
            ×
          </text>
        </view>

        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">
              角色名称
              <text class="required">*</text>
            </text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入角色名称"
              v-model="formData.name"
              maxlength="20"
            />
            <text
              class="error-text"
              v-if="errors.name"
            >
              {{ errors.name }}
            </text>
          </view>

          <view class="form-group">
            <text class="form-label">角色描述</text>
            <textarea
              class="form-textarea"
              placeholder="请输入角色描述"
              v-model="formData.description"
              maxlength="200"
            ></textarea>
          </view>

          <view class="form-group">
            <text class="form-label">角色状态</text>
            <view class="status-switch">
              <switch
                :checked="formData.status"
                @change="handleStatusChange"
                color="#d81e06"
              />
              <text class="switch-label">{{ formData.status ? "启用" : "禁用" }}</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">功能模块</text>
            <view class="permissions-grid">
              <view
                v-for="permission in moduleConfig"
                :key="permission.key"
                class="permission-item"
                :class="{ selected: isPermissionSelected(permission.key) }"
                @tap="togglePermission(permission.key)"
              >
                <text class="permission-name">{{ permission.name }}</text>
                <text
                  class="permission-check"
                  v-if="isPermissionSelected(permission.key)"
                >
                  ✓
                </text>
              </view>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">底部导航模块</text>
            <view class="permissions-grid">
              <view
                v-for="permission in tabbarConfig"
                :key="permission.key"
                class="permission-item"
                :class="{ selected: isPermissionSelected(permission.key) }"
                @tap="togglePermission(permission.key)"
              >
                <text class="permission-name">{{ permission.name }}</text>
                <text
                  class="permission-check"
                  v-if="isPermissionSelected(permission.key)"
                >
                  ✓
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <button
            class="modal-btn cancel-btn"
            @tap="closeModal"
          >
            取消
          </button>
          <button
            class="modal-btn confirm-btn"
            @tap="saveRole"
            :disabled="saving"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </view>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <view
      class="modal-overlay"
      v-if="showDeleteModal"
      @tap="closeDeleteModal"
    >
      <view
        class="modal-content delete-modal"
        @tap.stop
      >
        <view class="modal-header">
          <text class="modal-title">确认删除</text>
        </view>
        <view class="modal-body">
          <text class="delete-message">确定要删除角色： {{ deleteTarget.roleName }} 吗？</text>
          <text class="delete-warning">此操作不可撤销，请谨慎操作。</text>
        </view>
        <view class="modal-footer">
          <button
            class="modal-btn cancel-btn"
            @tap="closeDeleteModal"
          >
            取消
          </button>
          <button
            class="modal-btn delete-confirm-btn"
            @tap="confirmDelete"
            :disabled="deleting"
          >
            {{ deleting ? "删除中..." : "确认删除" }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { AddUserRole, deleteUserRole, getUserRoleList, updateUserRole } from "@/api/user";
import formatDate from "@/utils/formateDate";
import {getConfig, updateConfig} from '@/api/config';

export default {
  data() {
    return {
      // 角色列表数据
      roles: [],
      // 搜索关键词
      searchKeyword: "",
      // 弹窗显示状态
      showModal: false,
      showDeleteModal: false,
      // 编辑状态
      isEdit: false,
      // 表单数据
      formData: {
        id: null,
        name: "",
        description: "",
        status: true,
        functionList: [],
      },
      // 表单验证错误
      errors: {},
      // 保存状态
      saving: false,
      deleting: false,
      // 删除目标
      deleteTarget: null,
      // 模块配置
      moduleConfig: [
        { name: "拉屎分析", key: "thing-month-chart" },
        { name: "拉屎记录", key: "thing-history" },
        { name: "体重记录", key: "weight-history" },
        { name: "体重分析", key: "weight-chart" },
        { name: "做题分析", key: "problemMonthChart" },
        { name: "位置共享", key: "map" },
        { name: "想说的话", key: "want-say" },
        { name: "照片墙", key: "photo-wall" },
        { name: "相册", key: "photo-album" },
        { name: "计时器", key: "timeCount" },
        { name: "通知管理", key: "noticePage" },
        { name: "幸运转盘", key: "lucky" },
        { name: "拼豆图纸", key: "perlerBeads" },
        { name: "角色管理", key: "role" },
        { name: "年月总结", key: "summarize" },
        { name: "账号切换", key: "change" },
      ],
      // 底部导航栏
      tabbarConfig: [
        { name: "首页", key: "index" },
        { name: "盲盒", key: "blind" },
        { name: "做题记录", key: "problem" },
        { name: "消息", key: "chat" },
      ],
      systemConfig:{}
    };
  },
  computed: {
    // 过滤后的角色列表
    filteredRoles() {
      if (!this.searchKeyword?.trim()) {
        return this.roles;
      }
      const keyword = this.searchKeyword;
      return this.roles.filter((role) => role.roleName?.includes(keyword) || role.description?.includes(keyword));
    },
  },
  onLoad() {
    this.getUserRoleList();
    this.getConfig()
  },
  methods: {
    /**
     * 获取系统配置
     */
    getConfig(){
      getConfig().then(res=>{
        this.systemConfig = res?.length > 0 ? res[0] :{}
      })
    },
    formatDate,
    /**
     * 获取用户角色列表
     */
    getUserRoleList() {
      getUserRoleList().then((res) => {
        this.roles = res;
      });
    },
    // 搜索处理
    handleSearch() {
      // 实时搜索，通过computed属性filteredRoles实现
    },

    // 显示新增角色弹窗
    showAddRole() {
      this.isEdit = false;
      this.formData = {
        id: null,
        name: "",
        description: "",
        status: true,
        permissions: [],
        functionList: [],
      };
      this.errors = {};
      this.showModal = true;
    },

    // 编辑角色
    editRole(role) {
      this.isEdit = true;
      this.formData = {
        id: role._id,
        name: role.roleName,
        description: role.description,
        status: role.status,
        functionList: [...role.functionList],
      };
      this.errors = {};
      this.showModal = true;
    },
    /**
     * 设置为新增用户默认角色
     * @param role
     */
    setDefaultRole(role) {
      updateConfig({
        _id: this.systemConfig._id,
        newUserDefaultRole: role._id
      }).then(()=>{
        uni.showToast({
          title: "已设置为默认橘色",
          icon: "success",
        });

        this.getConfig()
      })
    },
    // 删除角色
    deleteRole(role) {
      this.deleteTarget = role;
      this.showDeleteModal = true;
    },
    // 关闭弹窗
    closeModal() {
      this.showModal = false;
      this.formData = {
        id: null,
        name: "",
        description: "",
        status: true,
        functionList: [],
      };
      this.errors = {};
    },

    // 关闭删除确认弹窗
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
    },

    // 状态切换处理
    handleStatusChange(e) {
      this.formData.status = e.detail.value;
    },

    // 权限选择切换
    togglePermission(permissionId) {
      const index = this.formData.functionList.indexOf(permissionId);
      if (index > -1) {
        this.formData.functionList.splice(index, 1);
      } else {
        this.formData.functionList.push(permissionId);
      }
    },

    // 检查权限是否被选中
    isPermissionSelected(permissionId) {
      return this.formData.functionList.includes(permissionId);
    },

    // 表单验证
    validateForm() {
      this.errors = {};

      if (!this.formData?.name?.trim()) {
        this.errors.name = "角色名称不能为空";
        return false;
      }

      if (this.formData?.name?.trim().length < 2) {
        this.errors.name = "角色名称至少2个字符";
        return false;
      }

      // 检查角色名称是否重复
      const existingRole = this.roles.find(
        (role) => role.roleName === this.formData?.name?.trim() && role._id !== this.formData.id,
      );
      if (existingRole) {
        this.errors.name = "角色名称已存在";
        return false;
      }

      return true;
    },

    /**
     * 保存角色
     * @returns {Promise<void>}
     */
    async saveRole() {
      if (!this.validateForm()) {
        return;
      }

      this.saving = true;

      const roleData = {
        ...this.formData,
        _id: this.formData.id,
        roleName: this.formData?.name?.trim(),
        description: this.formData?.description?.trim(),
      };

      if (this.isEdit) {
        // 编辑角色
        roleData.updateTime = formatDate(Date.now());
        updateUserRole(roleData)
          .then(() => {
            uni.showToast({
              title: "角色更新成功",
              icon: "success",
            });
            this.getUserRoleList();
          })
          .finally(() => {
            this.saving = false;
          });
      } else {
        // 新增角色
        roleData.createTime = formatDate(Date.now());
        AddUserRole(roleData)
          .then(() => {
            uni.showToast({
              title: "角色创建成功",
              icon: "success",
            });
            this.getUserRoleList();
          })
          .finally(() => {
            this.saving = false;
          });
      }

      this.closeModal();
    },
    /**
     * 确认删除
     * @returns {Promise<void>}
     */
    async confirmDelete() {
      if (!this.deleteTarget) return;

      this.deleting = true;

      deleteUserRole({
        _id: this.deleteTarget._id,
      })
        .then(() => {
          uni.showToast({
            title: "角色删除成功",
            icon: "success",
          });
          this.getUserRoleList();
        })
        .finally(() => {
          this.closeDeleteModal();
          this.deleting = false;
        });
    },
  },
};
</script>

<style>
.role-management {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  gap: 20rpx;
}

.search-bar {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  height: 80rpx;
  padding: 0 80rpx 0 30rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
  color: #999999;
}

.add-btn {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 80rpx;
  background-color: #d81e06;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
  box-shadow: 0 2rpx 10rpx rgba(0, 122, 255, 0.3);
}

.add-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

/* 角色列表 */
.role-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.role-item.disabled {
  opacity: 0.6;
}

.role-info {
  flex: 1;
}

.role-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.role-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 20rpx;
}

.role-status {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  background-color: #f0f0f0;
  color: #999999;
}

.role-status.active {
  background-color: #e8f5e8;
  color: #52c41a;
}

.role-description {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 15rpx;
  line-height: 1.4;
}

.role-meta {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999999;
}

.role-actions {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.action-btn {
  padding: 0 30rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  border: none;
}

.edit-btn {
  background-color: #d81e06;
  color: #ffffff;
}

.delete-btn {
  background-color: #ff3b30;
  color: #ffffff;
}

.default-btn {
  background-color: rgba(255, 59, 48, 0.88);
  color: #ffffff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999999;
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 60rpx;
  background-color: #d81e06;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: none;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.modal-close {
  font-size: 40rpx;
  color: #999999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-body {
  padding: 30rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 15rpx;
}

.required {
  color: #ff3b30;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #d81e06;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  resize: vertical;
}

.form-textarea:focus {
  border-color: #d81e06;
}

.error-text {
  font-size: 24rpx;
  color: #ff3b30;
  margin-top: 10rpx;
}

.status-switch {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.switch-label {
  font-size: 28rpx;
  color: #333333;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  transition: all 0.3s;
}

.permission-item.selected {
  border-color: #d81e06;
  background-color: #fff4f4;
}

.permission-name {
  font-size: 26rpx;
  color: #333333;
}

.permission-check {
  font-size: 24rpx;
  color: #d81e06;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  padding: 0 45rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  height: 70rpx;
  line-height: 70rpx;
  box-sizing: border-box;
  border: none;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333333;
}

.confirm-btn {
  background-color: #d81e06;
  color: #ffffff;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  color: #999999;
}

/* 删除确认弹窗 */
.delete-modal {
  max-width: 500rpx;
}

.delete-message {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
}

.delete-warning {
  font-size: 24rpx;
  color: #ff3b30;
}

.delete-confirm-btn {
  background-color: #ff3b30;
  color: #ffffff;
}

.delete-confirm-btn:disabled {
  background-color: #cccccc;
  color: #999999;
}
</style>
