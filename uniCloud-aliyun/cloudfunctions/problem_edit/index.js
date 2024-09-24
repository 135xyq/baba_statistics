'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		_id,
		type,
		typeName,
		time,
		totalNumber,
		errorNumber,
	} = event
	const res = await db.collection("problem").doc(_id).update({
		type,
		time: new Date(time).getTime(),
		typeName,
		totalNumber,
		errorNumber,
	});
	//返回数据给客户端
	return {
		code: 0,
		msg: '更新成功！'
	}
};