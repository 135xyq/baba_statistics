const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { page = 1, pageSize = 10 } = event
  
  try {
    const res = await db.collection('dish_types')
      .where({
        openid: OPENID
      })
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
