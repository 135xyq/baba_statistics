'use strict';
const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("user_role");
	const user = db.collection("user")
	const {_id} = event
	const userNumber = await user.where({roleId:_id}).count()

	if(userNumber?.total > 0){
		return {
			code: 1,
			msg:'该角色存在用户无法删除！',
			data:[],
		}
	}else{
		await collection.doc(_id).remove()

		//返回数据给客户端
		return {
			code:0,
			msg:'删除成功！',
			data:[],
		}
	}


};
