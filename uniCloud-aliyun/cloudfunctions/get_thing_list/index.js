'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("thing");
  
  const {openid, page,limit} = event
  
  const total = await collection.where({
    openid : openid,
  }).count()
  
  
  const data = await collection.where({
    openid : openid,
  }).orderBy('time',"desc").skip((page -1 ) * limit)
  .limit(limit)
  .get()

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:{
      list: data.data,
      total: total.total
    },
	}
};
