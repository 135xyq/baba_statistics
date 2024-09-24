'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("problem");
  
  const now = new Date(event.date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  
  const result = await db.collection('problem')
    .aggregate()
    .match({
		openid: event.openid,
      time: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
    .group({
      _id: {
		  type: "$type", // 根据 type 字段分组
		  typeName: "$typeName",
	  },
      totalNumber: { $sum: "$totalNumber" }, // 计算该类型的总数量
      errorNumber: { $sum: "$errorNumber" } // 计算该类型的总错误数量
    })
    .sort({ "_id.type": 1  }) // 按 type 排序
    .end();
	
	console.log(result);

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:result.data,
	}
};
