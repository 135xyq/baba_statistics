'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("thing");
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()- (8 * 60 * 60 * 1000);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()- (8 * 60 * 60 * 1000);
  
  const data = await collection.where({
    openid : event.openid,
    time: dbCmd.gte(startOfDay).and(dbCmd.lte(endOfDay))
  } ).orderBy('time','asc').get()

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:data.data,
	}
};
