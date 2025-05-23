<template>
  <view class="photo-gallery-container">
    <!-- 顶部分类选择器 -->
    <view class="category-selector">
      <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
        <view v-for="(category, index) in categories" :key="category._id" class="category-item"
          :class="{ active: currentCategory === category._id }" @tap="selectCategory(category._id)">
          {{ category.name }}
          <!-- 确保编辑和删除按钮在编辑模式下显示 -->
          <view v-if="isEditMode &&  category._id !== '-1' && category._id !== '1'" class="edit-category" @tap.stop="editCategory(category)">✎</view>
          <view v-if="isEditMode && category._id !== '-1' &&  category._id !== '1'" class="delete-category"
            @tap.stop="deleteCategory(category)">
            ×</view>
        </view>
        <!-- 添加分类按钮 -->
        <view class="category-item category-item-operate" @tap="showAddCategoryModal" v-if="!isEditMode">
          <text class="add-icon">＋</text>
        </view>
        <!-- 编辑模式切换 -->
        <view class="category-item category-item-operate" @tap="toggleEditMode">
          {{ isEditMode ? '✔' : '✎' }}
        </view>
      </scroll-view>
    </view>



    <!-- 上传按钮 -->
    <view class="upload-btn" @tap="handleUpload" v-if="!isEditMode">
      <text class="upload-icon">+</text>
      <text class="upload-text">上传照片</text>
    </view>

    <!-- 空状态提示 -->
    <view class="empty-state" v-if="photos.length === 0">
      <text class="empty-text">暂无照片，点击上方按钮上传</text>
    </view>

    <!-- 时间分组展示 -->
    <block v-if="photos.length > 0">
      <view v-for="(group, groupIndex) in photosByTime" :key="groupIndex" class="photo-group">
        <view class="group-title">{{ group.date }}</view>
        <view class="photo-grid" :style="{
          'grid-template-columns': `repeat(${columns}, 1fr)`,
          'gap': `${gap}rpx`
        }">
          <view v-for="(photo, photoIndex) in group.photos" :key="photo._id" class="photo-item"
            :style="{ 'aspect-ratio': aspectRatio }" @tap="previewPhoto(photo, group.photos)"
            @longpress="showPhotoInfo(photo)">
            <image class="photo-image" :src="photo.url" mode="aspectFill" lazy-load @error="handleImageError(photo)">
            </image>
            <view class="photo-overlay" v-if="isEditMode">
              <view class="delete-btn" @tap.stop="deletePhoto(photo)">×</view>
            </view>
            <view class="photo-error" v-if="photo.loadError">
              <text class="error-icon">!</text>
              <text class="error-text">加载失败</text>
            </view>
          </view>
          <!-- 分割线 -->
          <view v-if="photoIndex < group.photos.length - 1" class="photo-divider"></view>
        </view>
      </view>
    </block>

    <!-- 显示照片信息 -->
    <modal
      :visible="showCustomModal"
      title="照片信息"
      :content="modalContent"
      @close="showCustomModal = false"
    />
  </view>
</template>

<script>
import { photoTypeList, photoTypeEdit, photoTypeDelete, photoTypeAdd, photoList, photoAdd, photoDelete } from '@/api/photo.js'
import formateDate from "@/utils/formateDate.js";
export default {
  name: 'PhotoGallery',
  props: {
    // 自定义列数，默认为3
    columns: {
      type: Number,
      default: 3
    },
    // 自定义间距，单位rpx，默认为10
    gap: {
      type: Number,
      default: 10
    },
    // 自定义宽高比，默认为1（正方形）
    aspectRatio: {
      type: String,
      default: '1'
    },
    // 初始分类
    initialCategory: {
      type: String,
      default: '-1'
    }
  },
  data() {
    return {
      photos: [],
      // 分类数据
      categories: [],
      currentCategory: '-1',
      isEditMode: false,
      previewIndex: -1,
      showPreview: false,
      newCategoryName: '',
      showCategoryModal: false,
      isUploadImg: false,
      page: {
        limit: 15,
        page: 1,
        total: 0
      },
      showCustomModal: false,
      modalContent: ''
    }
  },
  computed: {
    // 按时间分组的照片
    photosByTime() {
      const groups = {};
      this.photos.forEach(photo => {
        const date = this.formatDate(photo.time);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(photo);
      });

      // 转换为数组并按日期排序
      return Object.keys(groups)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => ({
          date,
          photos: groups[date]
        }));
    },
  },
  created() {
    // 初始化分类
    this.currentCategory = this.initialCategory;


    this.getPhotoType()
    this.getPhotoList()
  },
  methods: {
    /** 
     * 获取照片类型
     */
    getPhotoType() {
      photoTypeList({}).then((res) => {
        this.categories = [{ _id: '-1', name: '全部' }].concat(res.list).concat([{ _id: '1', name: '其他' }])
      });
    },
    /**
     * 获取照片类型列表
     */
    getPhotoList() {
      photoList({
        type: this.currentCategory,
        page: this.page.page,
        limit: this.page.limit
      }).then((res) => {
        this.photos = res.list
        this.page.total = res.total
      });
    },
    /**
     * 获取第一页图片
     */
    getFirstPhotoList() {
      this.page = {
        page: 1,
        limit: 15,
        total: 0
      }
      this.getPhotoList()
    },

    // 选择分类
    selectCategory(categoryId) {
      this.currentCategory = categoryId;
      this.getPhotoList()
    },

    // 切换编辑模式
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    getFileId(tempFilePath) {
      return new Promise(async (resolve) => {
        const result = await uniCloud.uploadFile({
          filePath: tempFilePath,
          cloudPath: `photo/${new Date().getTime() + "-" + Math.random(0, 1)}`,
          cloudPathAsRealPath: true
        });
        console.log('rewqrq', result);

        resolve(result.fileID);
      });
    },

    // 处理上传
    handleUpload() {
      uni.chooseImage({
        count: 1, // 最多可选择的图片数量

        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.isUploadImg = true;

          // 处理选择的图片

          uni.showModal({
            title: '添加照片信息',
            editable: true,
            placeholderText: '请输入描述信息',
            success: async (descRes) => {
              if (descRes.confirm && descRes.content.trim()) {
                const description = descRes.content.trim();
                let path = ''

                if (this.isUploadImg) {
                  path = await this.getFileId(tempFilePath);


                  this.isUploadImg = false
                }
                const newPhoto = {
                  url: path,
                  type: this.currentCategory === '-1' ? '1' : this.currentCategory,
                  description,
                  createTime: formateDate(new Date().getTime()),
                };
                photoAdd(newPhoto).then((res) => {
                  uni.showToast({
                    title: '上传成功',
                    icon: 'success'
                  });
                  this.getFirstPhotoList()
                })
              }
            }
          });



        },
        fail: (err) => {
          console.error('选择图片失败', err);
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    },

    // 预览照片
    previewPhoto(photo, photoGroup) {
      const urls = photoGroup.map(p => p.url);
      const current = photo.url;

      uni.previewImage({
        urls,
        current,
        indicator: 'number',
        loop: true,
        fail: (err) => {
          console.error('预览图片失败', err);
        }
      });
    },

    showPhotoInfo(photo) {
      this.modalContent = `分类：${this.getCategoryName(photo.type)}\n描述：${photo.description}\n时间：${this.formatDate(photo.time)}`;
      this.showCustomModal = true;
    },

    // 删除照片
    deletePhoto(photo) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除选中的图片吗？`,
        success: (res) => {
          if (res.confirm) {
            photoDelete({ _id: photo._id }).then(() => {
              uni.showToast({
                icon: "success",
                title: "删除成功！",
              });
              this.getFirstPhotoList()
            });
          }
        }
      });
    },

    // 处理图片加载错误
    handleImageError(photo) {
      const index = this.photos.findIndex(p => p._id === photo._sid);
      if (index !== -1) {
        this.$set(this.photos[index], 'loadError', true);
      }
    },

    // 格式化日期
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },

    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c._id === categoryId);
      return category ? category.name : '其他';
    },

    // 获取瀑布流列的照片
    getColumnPhotos(photos, columnIndex) {
      return photos.filter((_, index) => index % this.columns === (columnIndex - 1));
    },

    // 显示添加分类的弹窗
    showAddCategoryModal() {
      this.newCategoryName = '';
      uni.showModal({
        title: '添加分类',
        editable: true,
        placeholderText: '请输入分类名称',
        success: (res) => {
          if (res.confirm && res.content.trim()) {
            this.addCategory(res.content.trim());
          }
        }
      });
    },

    /**
     * 添加分类
     * @param {*} name 
     */
    addCategory(name) {
      photoTypeAdd({
        createTime: formateDate(new Date().getTime()),
        name
      }).then((res) => {
        this.getPhotoType()
        uni.showToast({
          title: '分类添加成功',
          icon: 'success'
        });
      })

    },
    /**
     * 分类编辑
     * @param {*} category 
     */
    editCategory(category) {
      uni.showModal({
        title: '编辑分类',
        editable: true,
        placeholderText: '请输入新的分类名称',
        content: category.name,
        success: (res) => {
          if (res.confirm && res.content.trim()) {
            const newName = res.content.trim();
            photoTypeEdit({
              name: newName,
              _id: category._id
            }).then(res => {
              this.getPhotoType()
              uni.showToast({
                title: '分类更新成功',
                icon: 'success'
              });
            })
          }
        }
      });
    },
    /**
     * 删除分类
     * @param {*} category 
     */
    deleteCategory(category) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除分类 "${category.name}" 吗？`,
        success: (res) => {
          if (res.confirm) {
            photoTypeDelete({ _id: category._id }).then(() => {
              uni.showToast({
                icon: "success",
                title: "删除成功！",
              });
              this.getPhotoType();
            });
          }
        }
      });
    },
  }
}
</script>

<style>
.photo-gallery-container {
  padding: 20rpx;
}

/* 分类选择器样式 */
.category-selector {
  margin-bottom: 30rpx;
  position: relative;
}

.category-scroll {
  white-space: nowrap;
  padding: 10rpx 0;
}

.category-item {
  display: inline-block;
  position: relative;
  padding: 12rpx 30rpx;
  height: 45rpx;
  line-height: 45rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 28rpx;
  transition: all 0.3s;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.category-item.active {
  background-color: #d81e06;
  color: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 122, 255, 0.3);
}

.category-item-operate {
  color: #d81e06;
  font-size: 40rpx;
}


/* 排序选项样式 */
.sort-options {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.sort-title {
  font-size: 28rpx;
  margin-right: 20rpx;
}

.sort-item {
  padding: 6rpx 20rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  border-radius: 20rpx;
  background-color: #f0f0f0;
}

.sort-item.active {
  background-color: #d81e06;
  color: #ffffff;
}

/* 编辑模式切换按钮 */
.edit-toggle {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 10rpx 30rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 28rpx;
}

/* 上传按钮样式 */
.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 30rpx auto;
  width: 200rpx;
  height: 200rpx;
  background-color: #f8f8f8;
  border-radius: 20rpx;
  border: 2rpx dashed #cccccc;
  transition: all 0.3s;
}

.upload-btn:active {
  background-color: #eeeeee;
  transform: scale(0.98);
}

.upload-icon {
  font-size: 70rpx;
  color: #d81e06;
  line-height: 1;
}

.upload-text {
  font-size: 28rpx;
  color: #666666;
  margin-top: 10rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 照片组样式 */
.photo-group {
  margin-bottom: 40rpx;
}

.group-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  border-left: 8rpx solid #d81e06;
}

/* 网格布局样式 */
.photo-grid {
  display: grid;
  width: 100%;
}

.photo-item {
  position: relative;
  overflow: hidden;
  border-radius: 10rpx;
}

.photo-image {
  width: 100%;
  height: 100%;
  display: block;
}

/* 瀑布流布局样式 */
.photo-waterfall {
  display: flex;
  width: 100%;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 5rpx;
}

.waterfall-item {
  position: relative;
  margin-bottom: 10rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

/* 照片叠加层样式 */
.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.photo-item:hover .photo-overlay,
.waterfall-item:hover .photo-overlay {
  opacity: 1;
}

.delete-btn {
  width: 70rpx;
  height: 70rpx;
  background-color: rgba(255, 255, 255, 0.9);
  color: #ff3b30;
  border-radius: 35rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.delete-btn:active {
  transform: scale(0.95);
  background-color: rgba(255, 255, 255, 1);
}

/* 图片错误样式 */
.photo-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.edit-category {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10rpx;
  /* 调整位置以避免与删除按钮重叠 */
  font-size: 24rpx;
  color: #d81e06;
  cursor: pointer;
}

.delete-category {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10rpx;
  font-size: 24rpx;
  color: #ff3b30;
  cursor: pointer;
}

.error-icon {
  font-size: 60rpx;
  color: #ff0000;
  margin-bottom: 10rpx;
}

.error-text {
  font-size: 28rpx;
  color: #999999;
}
.photo-divider {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10rpx 0;
}
</style>