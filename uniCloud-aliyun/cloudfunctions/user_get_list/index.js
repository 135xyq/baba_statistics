'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const {openid,type} = event
	//event为客户端上传的参数
	const collection = db.collection("user");
  

  let data = {data:[]}
  
  if(type === 'list'){
    // 使用聚合查询关联user_role表
		data = await db.collection('user')
    .aggregate()
    .match({
      openid: dbCmd.neq(openid),
      isHidden: dbCmd.neq(true)
    })
    .lookup({
      from: 'user_role',
      localField: 'roleId',
      foreignField: '_id',
      as: 'roleInfo'
    })
    .project({
      _id: 1,
      nickName: 1,
      openid: 1,
      roleId: 1,
      "gender": 1,
      "avatarUrl":1,
      "isHidden": true,
      roleName: $.arrayElemAt(['$roleInfo.roleName', 0]),
      roleLevel: $.arrayElemAt(['$roleInfo.roleLevel', 0]),
      functionList: $.arrayElemAt(['$roleInfo.functionList', 0])
    })
    .end()

  }else{
     data = await collection.get()
  }
  

	//返回数据给客户端
	return {
		code:0,
		mag:'获取成功！',
		data: data.data,
	}
};