'use strict';


const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
	//event为客户端上传的参数
  const collection = db.collection("user");
  const userInfo = await collection.where({
    openid: event.openid
  }).get();
	//返回数据给客户端
	return {
	  code: 0,
	  mag: '获取成功！',
	  data: userInfo.data[0],
	}
};
