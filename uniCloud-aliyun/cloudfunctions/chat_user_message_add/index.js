"use strict";
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log("event : ", event);
  const { senderOpenid, receiverOpenid, content, createTime } = event;
  const collection = db.collection("chat");

  await collection.add({
    senderOpenid,
    receiverOpenid,
    content,
    createTime,
    isRead: false,
    time: Date.now(),
  });

  //返回数据给客户端
  return {
    code: 0,
    mag: "新增成功！",
    data: {},
  };
};
