'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("thing");
  
  const now = new Date(event.date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
const result = await db.collection('problem')
  .aggregate()
  .match({
    time: {
      $gte: startOfDay,
      $lt: endOfDay
    },
				openid: event.openid
  })
  .group({
    _id: null,
    totalNumber: { $sum: "$totalNumber" },
    errorNumber: { $sum: "$errorNumber" }
  })
  .end();
  
console.log(result);

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:result,
	}
};
