'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const {
    _id,
    content,
    toUserOpenId,
    status,
    color
  } = event
  const res = await db.collection("wantSay").doc(_id).update({
    content,
    toUserOpenId,
    status,
    color
  });
  //返回数据给客户端
  return {
    code: 0,
    msg: '更新成功！'
  }
};