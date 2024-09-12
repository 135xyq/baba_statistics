'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
// 新增记录
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("thing");
	const data = {openid: event.openid, time: Date.now(), create_time: new Date().toLocaleString()}
	await collection.add(data);
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  // 统计数量
  const count = await collection.where({
    openid : event.openid,
    time: dbCmd.gte(startOfDay.getTime()).and(dbCmd.lte(endOfDay.getTime()))
  } ).count()

	//返回数据给客户端
	return {
		code:0,
		mag:'新增成功！',
		data:count.total,
	}
};
