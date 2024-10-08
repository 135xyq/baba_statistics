'use strict';
/**
 * 删除一个记录
 */
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {_id,newData} = event;
	let res = await db.collection("lucky").doc(_id).remove()
	//返回数据给客户端
	return {
		code:0,
		msg:'删除成功！',
		data:{}
	}
};
