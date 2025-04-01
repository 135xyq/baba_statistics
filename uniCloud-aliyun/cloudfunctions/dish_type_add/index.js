const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const { name } = event
  
  if (!name) {
    return {
      code: -1,
      msg: '菜品分类名称不能为空'
    }
  }
  
  try {
    const res = await db.collection('dish_types').add({
      data: {
        name,
        openid: OPENID,
        createTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      data: res._id
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
