'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		openid,
		avatarUrl,
		gender,
    nickName
	} = event
  const res = await db.collection("user").where({
  	openid,
  }).update({
		avatarUrl,
		gender,
    nickName
  });
	//返回数据给客户端
	return {
		code:0,
		msg:'更新成功！'	
	}
};
