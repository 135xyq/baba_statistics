'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
  const {code} = event
  
	const res = await uniCloud.request({
	  url: 'https://api.weixin.qq.com/sns/jscode2session',
    method:'GET',
    data:{
      appid:'wxf600daae2dc114e6',
      secret:'5d99b080ddd9ac1c989b862af21bf694',
      js_code:code,
      grant_type:'authorization_code'
    }
	})
  
  if(res.statusCode === 200) {
    //返回数据给客户端
    return {
    	code:0,
    	msg:'',
    	data:{
        openid: res.data.openid
      }
    }
  }else{
    //返回数据给客户端
    return {
    	code:500,
    	msg:'网络异常',
    	data:{ }
    }
  }



};


