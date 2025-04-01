const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { id, name } = event
  
  if (!id || !name) {
    return {
      code: -1,
      msg: '参数不完整'
    }
  }
  
  try {
    await db.collection('dish_types')
      .where({
        _id: id,
        openid: OPENID
      })
      .update({
        data: {
          name,
          updateTime: db.serverDate()
        }
      })
    
    return {
      code: 0
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
