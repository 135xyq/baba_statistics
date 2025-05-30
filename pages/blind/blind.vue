<template>
  <view class="blind-container">
    <!-- 加载 -->
    <view
      class="loading"
      v-if="isTypeLoading"
    >
      <u-loading-icon
        color="#d81e06"
        textColor="#d81e06"
        vertical
        text="努力加载中..."
      />
    </view>
    <view v-else>
      <view v-if="typeListData.length <= 0">
        <view class="empty">
          <u-empty
            text="还没买盲盒呢"
            icon="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/cloudstorage/系统/盲盒组合.png"
          />
        </view>
      </view>
      <view v-else>
        <!-- 盲盒类型 -->
        <view class="left-list">
          <u-list>
            <u-list-item
              v-for="item in typeListData"
              :key="item._id"
            >
              <view
                class="list-item"
                :class="{ active: item._id === activeCategory }"
                @click="onHandleChangeCategory(item._id)"
              >
                {{ item.name }}
              </view>
            </u-list-item>
          </u-list>
        </view>
        <!-- 盲盒列表 -->
        <view class="right-list">
          <view
            class="loading"
            v-if="isLoading"
          >
            <u-loading-icon
              color="#d81e06"
              textColor="#d81e06"
              vertical
              text="努力加载中..."
            />
          </view>
          <view v-else>
            <scroll-view
              v-if="dataList.length > 0"
              scroll-y="true"
              scroll-top="0"
            >
              <view
                v-for="item in dataList"
                :key="item"
              >
                <uni-card
                  :title="item.name"
                  :sub-title="item.createTime"
                  :extra="item.price ? item.price + '元' : ''"
                  padding="10px 0"
                >
                  <image
                    class="right-list__img"
                    :src="item.coverImg"
                    @click="onPreviewImage(item)"
                  />
                  <text class="uni-body uni-mt-5">{{ item.remark }}</text>
                </uni-card>
              </view>
            </scroll-view>
            <view
              v-else
              class="empty"
            >
              <u-empty
                text="还没买盲盒呢"
                icon="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/cloudstorage/系统/盲盒组合.png"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <!-- 前往新增和编辑页面 -->
      <uni-fab
        ref="fab"
        :pattern="pattern"
        horizontal="right"
        vertical="bottom"
        :pop-menu="true"
        :content="content"
        @trigger="onAddBlind"
      />
    </view>
    <!-- 自定义导航 -->
    <custom-tab />
  </view>
</template>

<script>
import rankingImg from "@/static/img/ranking-active.png";
import { blindList, blindTypeList } from "@/api/blind";
export default {
  data() {
    return {
      rankingImg,
      // 类型列表
      typeListData: [],
      // 数据列表
      dataList: [],
      openid: "",
      // 当前选中的类型
      activeCategory: "",
      // 正在加载
      isTypeLoading: false,
      isLoading: false,
      // 悬浮按钮配置
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        selectedColor: "#d81e06",
        buttonColor: "#d81e06",
        iconColor: "#fff",
        icon: "compose",
      },
      // 悬浮按钮内容
      content: [
        {
          iconPath: "/static/img/blind-add-type.png",
          selectedIconPath: "/static/img/blind-add-type-active.png",
          text: "类型",
          active: false,
        },
        {
          iconPath: "/static/img/blind-add.png",
          selectedIconPath: "/static/img/blind-add-active.png",
          text: "盲盒",
          active: false,
        },
      ],
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    /**
     * 获取分类列表
     */
    getCategoryList() {
      this.isTypeLoading = true;
      blindTypeList({
        page: 1,
        limit: 100,
      }).then((res) => {
        this.typeListData = res?.list;
        if (this.typeListData?.length > 0) {
          this.activeCategory = this.typeListData[0]._id;
          this.getDataList();
        }
        this.isTypeLoading = false;
      });
    },
    /**
     * 获取对应分类的数据列表
     */
    getDataList() {
      this.isLoading = true;
      blindList({ page: 1, limit: 100, type: this.activeCategory }).then((res) => {
        this.dataList = res.list;
        this.isLoading = false;
      });
    },
    /**
     * 切换分类，重新获取资源
     * @param {Object} id
     */
    async onHandleChangeCategory(id) {
      this.activeCategory = id;
      this.getDataList();
    },
    /**
     * 点击悬浮窗
     * @param {Object} item
     */
    onAddBlind(item) {
      this.content = [
        {
          iconPath: "/static/img/blind-add-type.png",
          selectedIconPath: "/static/img/blind-add-type-active.png",
          text: "类型",
          active: false,
        },
        {
          iconPath: "/static/img/blind-add.png",
          selectedIconPath: "/static/img/blind-add-active.png",
          text: "盲盒",
          active: false,
        },
      ];

      const index = item.index;
      this.$refs.fab.close();

      if (index === 0) {
        uni.navigateTo({
          url: "/subPackages/blind-type/blind-type",
        });
      } else {
        uni.navigateTo({
          url: "/subPackages/blind-add/blind-add",
        });
      }
    },
    /**
     * 图片预览
     * @param {Object} data
     */
    onPreviewImage(data) {
      if (data.coverImg) {
        uni.previewImage({
          current: data.coverImg,
          urls: [data.coverImg],
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.blind-container {
  position: relative;
  width: 100%;
}

.left-list {
  position: fixed;
  // top: 0;
  width: 35%;
  overflow: hidden;
  background-color: #b4160473;
  color: #fff;

  .list-item {
    width: 100%;
    color: black;
    height: 100rpx;
    line-height: 100rpx;
    padding: 2px 10px;
    overflow: hidden;
    border-left: 3px solid transparent;
    white-space: nowrap;
    text-overflow: ellipsis;

    &.active {
      background-color: #d81e0661;
      font-weight: 600;
      color: #fff;
      border-left: 3px solid #d81e06;
    }
  }
}

.right-list {
  width: 65%;
  // background-color: red;
  color: #eee;
  position: absolute;
  left: 35%;
  padding-bottom: 50px;

  ::v-deep .right-list__img {
    width: 100%;
    max-height: 500rpx;
    object-fit: cover;
  }
}

.loading,
.empty {
  margin-top: 400rpx;
}

::v-deep {
  .uni-fab{
  bottom: 200rpx !important;
}
.uni-fab__circle{
  bottom: 200rpx !important;
}
}
</style>
