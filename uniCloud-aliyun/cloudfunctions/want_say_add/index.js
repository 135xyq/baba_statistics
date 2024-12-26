'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
// 新增记录
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const collection = db.collection("wantSay");
  const {
    openid,
    content,
    toUserOpenId,
    createTime,
    color,
    time,
    status
  } = event
  const data = {
    openid,
    content,
    createTime,
    toUserOpenId,
    time: Date.now(),
    color,
    status
  }
  const res= await collection.add(data);
console.log(res);
  //返回数据给客户端
  return {
    code: 0,
    mag: '新增成功！',
    data: {},
  }
};