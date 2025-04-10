'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const {
    _id,
    content,
    time,
    isShow,
    isTimeDown
  } = event
  const res = await db.collection("notice").doc(_id).update({
    content,
    time,
    isShow,
    isTimeDown
  });
  //返回数据给客户端
  return {
    code: 0,
    msg: '更新成功！'
  }
};