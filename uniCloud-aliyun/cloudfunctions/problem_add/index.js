'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
function formate(time) {
	const date = new Date(+time);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
	const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
	const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
	const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
	const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
	return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}

// 新增记录
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("problem");
	const {openid, type, totalNumber, errorNumber, typeName} = event
	const data = {
		openid: openid,
		type, 
		totalNumber, 
		errorNumber,
		typeName,
		time:new Date().getTime(),
		create_time: formate(new Date().getTime())
	}
	await collection.add(data);

	//返回数据给客户端
	return {
		code: 0,
		mag: '新增成功！',
		data: {},
	}
};