<template>
  <view class="page-wall">
    <!-- 瀑布流布局容器 -->
    <view class="waterfall-container">
      <view v-for="(column, columnIndex) in columns" :key="columnIndex" class="waterfall-column">
        <view 
          v-for="(item, index) in column" 
          :key="item.id" 
          class="waterfall-item"
          @click="onPreviewImage(column[index] && column[index].url)"
        >
          <image 
            :src="item.url" 
            :style="{ height: item.height + 'px' }"
            lazy-load
            mode="widthFix"
            @load="onImageLoad($event, columnIndex, index)"
            @error="onImageError(columnIndex, index)"
          />
        </view>
      </view>
    </view>
    
    <!-- 加载状态提示 -->
    <view class="status-tip">
      <view v-if="loading" class="loading">
        <text class="cuIcon-loading2 iconfont-spin"></text>
        <text>加载中...</text>
      </view>
      <view v-else-if="!hasMore" class="no-more">没有更多数据了</view>
      <view v-else-if="error" class="error" @tap="retryLoad">
        <text>加载失败，点击重试</text>
      </view>
    </view>
  </view>
</template>

<script>
import {photoList} from "@/api/photo"
export default {
  data() {
    return {
      columns: [[], [], []], // 三列数据
      // 分页数据信息
      page: {
        limit: 20,
        page: 1,
        total: 0
      },
      loading: false,
      hasMore: true,
      // 所有你图片的URL
      allImagesUrls:[],
      minImageHeight: 120, // 最小图片高度
      error: false, // 添加错误状态
      retrying: false // 添加重试状态
    }
  },
  onLoad() {
    this.loadImages()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadImages()
    }
  },
  onPullDownRefresh() {
    this.resetData()
    this.loadImages().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    // 重置数据
    resetData() {
      this.columns = [[], [], []]
      this.page.page = 1 // 修正页码重置
      this.allImagesUrls = []
      this.hasMore = true
      this.error = false
      this.retrying = false
    },
    
    // 加载图片
    async loadImages() {
      if (this.loading || (!this.hasMore && !this.retrying)) return
      
      this.loading = true
      this.error = false
      
      try {
        const res = await photoList({
          type: this.currentCategory,
          page: this.page.page,
          limit: this.page.limit
        })
        
        const { list, total } = res
        
        // 更新是否还有更多数据
        this.hasMore = this.page.page * this.page.limit < total
        this.allImagesUrls = [...this.allImagesUrls, ...list.map(item => item.url)]
        
        if (list && list.length > 0) {
          // 处理图片数据
          list.forEach((item,index) => {
            const shortestColumn = this.getShortestColumn()
            const randomHeight = this.minImageHeight * (1 + Math.random())
            shortestColumn.push({
              ...item,
              index,
              height: Math.floor(randomHeight),
              loaded: false
            })
          })
          
          this.page.page++
        } else if (this.page.page === 1) {
          // 首页无数据
          this.hasMore = false
        }
        
        this.retrying = false
      } catch (error) {
        console.error('加载图片失败：', error)
        this.error = true
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 重试加载
    retryLoad() {
      if (this.error) {
        this.retrying = true
        this.loadImages()
      }
    },
    
    // 图片加载完成
    onImageLoad(event, columnIndex, index) {
      const { height } = event.detail
      const width = this.getColumnWidth()
      // 计算等比例缩放后的高度，增加随机范围
      const randomFactor = 0.8 + Math.random() * 0.4 // 生成0.8到1.2之间的随机数
      const scaledHeight = Math.max(
        this.minImageHeight,
        Math.floor((height * width * randomFactor) / event.detail.width)
      )
      
      // 标记图片已加载并更新高度
      this.columns[columnIndex][index] = {
        ...this.columns[columnIndex][index],
        height: scaledHeight,
        loaded: true
      }
      
    },
    
    // 获取最短的列
    getShortestColumn() {
      let minHeight = Infinity
      let shortestColumn = this.columns[0]
      
      this.columns.forEach(column => {
        const columnHeight = this.getColumnHeight(column)
        if (columnHeight < minHeight) {
          minHeight = columnHeight
          shortestColumn = column
        }
      })
      
      return shortestColumn
    },
    
    // 计算列高度
    getColumnHeight(column) {
      return column.reduce((height, item) => height + item.height, 0)
    },
    
    // 获取列宽度
    getColumnWidth() {
      const systemInfo = uni.getSystemInfoSync()
      const gap = 10 // 图片间距
      return (systemInfo.windowWidth - gap * 4) / 3 // 三列布局
    },
    
    // 图片加载失败
    onImageError(columnIndex, index) {
      this.columns[columnIndex][index].height = this.minImageHeight
    },
    
    
    // 预览图片
    onPreviewImage(current) {
      uni.previewImage({
        current,
        urls: this.allImagesUrls
      })
    },
    
    // 获取当前列的所有图片URL
    getColumnImages(columnIndex) {
      return this.columns[columnIndex].map(item => item.url)
    }
  }
}
</script>

<style lang="scss">
.page-wall {
  padding: 10px;
  
  .waterfall-container {
    display: flex;
    justify-content: space-between;
  }
  
  .waterfall-column {
    width: calc((100% - 20px) / 3); // 三列布局，20px为列间距
  }
  
  .waterfall-item {
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f5f5f5;
    
    image {
      width: 100%;
      display: block;
    }
  }
  
  .loading, .no-more {
    text-align: center;
    padding: 20px 0;
    color: #999;
    font-size: 14px;
  }
}

@keyframes loading-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
