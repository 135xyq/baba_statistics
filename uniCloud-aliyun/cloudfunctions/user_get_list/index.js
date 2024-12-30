'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
  const {openid,type} = event
	//event为客户端上传的参数
	const collection = db.collection("user");
  

  let data = {data:[]}
  
  if(type === 'list'){
    data = await collection.where({
      openid: dbCmd.neq(openid),
      isHidden: dbCmd.neq(true)
    }).get()
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