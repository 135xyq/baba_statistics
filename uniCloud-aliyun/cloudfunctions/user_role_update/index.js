"use strict";
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const { _id, roleName, status, description, functionList,updateTime } = event;
  const res = await db.collection("user_role").doc(_id).update({
    functionList,
    roleName,
    status,
    description,
    updateTime
  });
	console.log(res)
  //返回数据给客户端
  return {
    code: 0,
    msg: "更新成功！",
  };
};
