'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("photo_type");
  

  const data = await collection.get()

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data:{
      list: data.data,
    },
	}
};
