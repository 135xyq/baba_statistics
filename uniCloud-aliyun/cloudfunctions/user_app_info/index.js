// 返回小程序的APPID和secret
'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	//返回数据给客户端
	return {
    code: 0,
    data:{
      appid:'wxf600daae2dc114e6',
      secret:'1dd92382dbe76240929007795b89005e'
    }
  }
};
