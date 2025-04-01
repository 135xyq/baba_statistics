'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  const { openid, dishes, totalPrice, remark } = event
  
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return {
      code: -1,
      msg: '菜品信息不能为空'
    }
  }
  
  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return {
      code: -1,
      msg: '总价不合法'
    }
  }
  
  try {
    const orderNo = Date.now().toString() + Math.floor(Math.random() * 1000)
    const res = await db.collection('orders').add({
      data: {
        openid,
        orderNo,
        dishes,
        totalPrice,
        remark,
        status: 1, // 1: 待处理
        createTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      data: {
        orderId: res._id,
        orderNo
      }
    }
  } catch (e) {
    return {
      code: -1,
      msg: e.message
    }
  }
}
