const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { orderId } = event
  
  if (!orderId) {
    return {
      code: -1,
      msg: '缺少订单ID'
    }
  }
  
  try {
    const res = await db.collection('orders')
      .where({
        _id: orderId,
        openid: OPENID
      })
      .get()
    
    if (res.data.length === 0) {
      return {
        code: -1,
        msg: '订单不存在或无权查看'
      }
    }
    
    return {
      code: 0,
      data: res.data[0]
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
