"use strict";
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { _id, newUserDefaultRole } = event;
	const res = await db.collection("system_config").doc(_id).update({
		newUserDefaultRole
	});
	console.log(res)
	//返回数据给客户端
	return {
		code: 0,
		msg: "更新成功！",
	};
};
