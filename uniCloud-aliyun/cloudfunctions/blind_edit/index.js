'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const {
    _id,
    name,
    coverImg,
    time,
    price,
    remark
  } = event
  const res = await db.collection("blind").doc(_id).update({
    name,
    coverImg,
    time,
    price,
    remark
  });
  console.log(res,event);
  //返回数据给客户端
  return {
    code: 0,
    msg: '更新成功！'
  }
};