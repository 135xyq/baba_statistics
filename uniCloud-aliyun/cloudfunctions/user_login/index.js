'use strict';
const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const collection = db.collection("user");
  const userInfo = await collection.where({
    openid: event.openid
  }).get();



  if (userInfo?.affectedDocs === 0) {
    const systemConfig = db.collection("system_config");
    const data = await systemConfig .skip(0)
        .limit(1)
        .get()
    const roleId = data.data[0].newUserDefaultRole;
    // 第一次登录，将用户存入用户表
    await collection.add({
      ...evant,
      roleId: roleId
    });
  }
  //返回数据给客户端
  return {
    code: 0,
    mag: '登录成功！',
    data: event,
  }
};