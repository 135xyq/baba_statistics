// 接口请求封装

import store from "@/store/index.js";
const openid = store.state.userInfo?.userInfo?.openid;
export default ({ name, data = {} }) => {
  const loading = data.isLoading;
  data.isLoading && delete data.isLoading;
  const openid = store.state.userInfo?.userInfo?.openid;

  // 如果没有openi跳转到登录页面

  return new Promise((resolve, reject) => {
    loading &&
      uni.showLoading({
        title: "加载中",
      });
    // 拼接后的请求参数
    const finallyData = {
      openid: openid,
      ...data,
    };
    if (!finallyData.openid) {
      uni.switchTab({
        url: "/pages/login/login",
      });
      uni.showToast({
        title: "请先登录",
        icon: "none",
      });
      reject("未登录");
    } else {
      uniCloud.callFunction({
        name,
        data: finallyData,
        success({ result }) {
          if (result.code === 0) {
            resolve(result.data);
          } else {
            uni.showToast({
              icon: "none",
              title: result.msg || '接口异常',
            });
          }
        },
        fail(err) {
          reject(err);
        },
        complete(res) {
          loading && uni.hideLoading();
        },
      });
    }
  });
};
