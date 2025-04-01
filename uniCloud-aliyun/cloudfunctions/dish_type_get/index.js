const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { id } = event
  
  if (!id) {
    return {
      code: -1,
      msg: '缺少id参数'
    }
  }
  
  try {
    const res = await db.collection('dish_types')
      .where({
        _id: id,
        openid: OPENID
      })
      .get()
    
    if (res.data.length === 0) {
      return {
        code: -1,
        msg: '未找到该分类'
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
