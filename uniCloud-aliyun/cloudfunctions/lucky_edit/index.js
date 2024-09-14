'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		_id,
		text,
    range
	} = event
  const res = await db.collection("lucky").doc(_id).update({
		text,
    range
  });
	//返回数据给客户端
	return {
		code:0,
		msg:'更新成功！'	
	}
};
