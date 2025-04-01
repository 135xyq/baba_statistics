'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	const {openid} = event
  const { name, price, typeId, imageUrl, description, isAvailable } = event
  
  if (!name || !price || !typeId || !imageUrl || typeof isAvailable === 'undefined') {
    return {
      code: -1,
      msg: '参数不完整'
    }
  }
  
  try {
    const res = await db.collection('dishes').add({
      data: {
        name,
        price,
        typeId,
        imageUrl,
        description: description || '',
        isAvailable: !!isAvailable,
        openid: openid,
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
