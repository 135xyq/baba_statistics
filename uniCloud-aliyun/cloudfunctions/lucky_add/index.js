'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
// 新增记录
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("lucky");
	const data = {openid: event.openid, time: Date.now(),text: event.text, range: event.range || 1}
	await collection.add(data);

	//返回数据给客户端
	return {
		code:0,
		mag:'新增成功！',
		data: {},
	}
};
