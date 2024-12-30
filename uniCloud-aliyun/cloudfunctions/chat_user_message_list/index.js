"use strict";
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { openid, friendOpenid } = event;
  const chatRecordsRes = await db
    .collection("chat")
    .where(
      db.command.or(
        { senderOpenid: openid, receiverOpenid: friendOpenid },
        { senderOpenid: friendOpenid, receiverOpenid: openid },
      ),
    )
    .orderBy("time", "asc") // 按时间倒序排列
    .get();

  const updateRes = await db
    .collection("chat")
    .where({
      receiverOpenid: openid,
      senderOpenid: friendOpenid,
      isRead: false,
    })
    .update({
      isRead: true, // 将这些未读消息标记为已读
    });
  //返回数据给客户端
  return {
    code: 0,
    mag: "获取成功！",
    data: chatRecordsRes.data,
  };
};
