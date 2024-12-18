'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const collection = db.collection("wantSay");
  // 查询 user 表，获取对应的用户信息
  const userRes = await db.collection('user').get();
  const userList = userRes.data

  const {
    openid,
    type
  } = event
  let data = {
    data: []
  }
  // 发送的
  if (type == 0) {
    data = await collection.where({
      openid: openid,
    }).orderBy('time','desc').get()
  } else if (type == 1) {
    // 收到的
    data = await collection.where({
      toUserOpenId: openid,
    }).orderBy('time','desc').get()
  }

  const result = data.data.map(item => {
    const temp = {
      ...item
    }
    for (let i = 0; i < userList.length; i++) {
      const user = userList[i]
      if (item.openid === user.openid) {
        temp.nickName = user.nickName
        temp.avatarUrl = user.avatarUrl
      }
      if (item.toUserOpenId === user.openid) {
        temp.toUserNickName = user.nickName
        temp.toUserAvatarUrl = user.avatarUrl
      }
    }
    return temp
  })

  //返回数据给客户端
  return {
    code: 0,
    mag: '获取成功！',
    data: result,
  }
};