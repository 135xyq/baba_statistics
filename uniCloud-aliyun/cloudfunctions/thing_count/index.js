'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
// 数量
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("thing");
  const count = await collection.where({
    openid: event.openid
  }).count()
  

	//返回数据给客户端
	return {
		code:0,
		mag:'成功',
		data: count.total,
	}
};
