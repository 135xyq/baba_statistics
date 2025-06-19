"use strict";
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { roleName, status, description, functionList,createTime } = event;
	const res = await db.collection("user_role").add({
		functionList,
		roleName,
		status,
		description,
		createTime,
		time:Date.now()
	});
	console.log(res,'新增')
	//返回数据给客户端
	return {
		code: 0,
		msg: "新增成功！",
	};
};