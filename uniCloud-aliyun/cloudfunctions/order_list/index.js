const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { status, page = 1, pageSize = 10 } = event
  
  try {
    const where = { openid: OPENID }
    if (status !== undefined) {
      where.status = status
    }
    
    const res = await db.collection('orders')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      code: 0,
      data: res.data
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
