'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const collection = db.collection("blind");

  const {
    page,
    limit,
    type
  } = event
  let data
  let total
  if (type) {
    total = await collection.where({
      type: type
    }).count()

    const result  = await collection.where({
        type: type
      }).skip((page - 1) * limit)
      .limit(limit)
      .get()
      
      data = result.data

  } else {
    total = await collection.count()
    const result = await db.collection('blind')
      .aggregate()
      .lookup({
        from: 'blindType', // 联接的表
        localField: 'type', // blind 表中的字段
        foreignField: '_id', // blindType 表中的字段
        as: 'typeInfo' // 输出数组字段
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .end();
    // 将结果格式化，包含类型名称
    data = result.data.map(item => ({
      ...item,
      typeName: item.typeInfo.length > 0 ? item.typeInfo[0].name : '未知' // 获取类型名称
    }));
  }



  //返回数据给客户端
  return {
    code: 0,
    mag: '获取成功！',
    data: {
      list: data,
      total: total.total
    },
  }
};