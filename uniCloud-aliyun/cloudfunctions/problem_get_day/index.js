'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("problem");
  
  const now = new Date(event.date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  console.log(event.date,startOfDay, endOfDay,startOfDay.getTime(),endOfDay.getTime());
  const data = await collection.where({
    openid : event.openid,
    time: dbCmd.gte(startOfDay.getTime()).and(dbCmd.lte(endOfDay.getTime()))
  } ).orderBy('time','asc').get()
  
  console.log(data);

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:data.data,
	}
};
