'use strict';
const db = uniCloud.database();
const dbCmd = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
  //event为客户端上传的参数
  const {
    openid,
    type,
    date
  } = event

  // 开始时间和结束时间
  let startTime = ''
  let endTime = ''

  // 获取开始时间和结束时间
  if (type === 'year') {
    startTime = new Date(`${date.year}-01-01 00:00:00`).getTime()
    endTime = new Date(`${date.year}-12-31 23:59:59`).getTime()
  } else {
    startTime = new Date(date.year, date.month - 1, 1).getTime() - (8 * 60 * 60 * 1000);
    endTime = new Date(date.year, date.month, 0, 23, 59, 59, 999).getTime() - (8 * 60 * 60 * 1000);
  }

  // 获取拉屎数量
  const thingConut = await db.collection('thing').where({
    openid: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count()

  // 获取做题正确率和做题数量，做题时长
  const problemResult = await db.collection('problem').aggregate()
    .match({
      openid: openid,
      time: dbCmd.gte(startTime).lte(endTime) // 根据时间段筛选数据
    })
    .group({
      _id: null, // 不按某个字段分组，所有数据聚合在一起
      totalNumber: {
        $sum: "$totalNumber"
      },
      errorNumber: {
        $sum: "$errorNumber"
      },
      useTime: {
        $sum: ($.ifNull(['$useTime', 0]))
      }
    })
    .end();

  // 发送的话
  const wantSaySend = await db.collection('wantSay').where({
    openid: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count()

  // 收到的话
  const wantSayGet = await db.collection('wantSay').where({
    toUserOpenId: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count()



  //返回数据给客户端
  return {
    code: 0,
    mag: '成功',
    data: {
      thing: thingConut.total,
      wantSaySend: wantSaySend.total,
      wantSayGet: wantSayGet.total,
      ...problemResult.data[0]
    },
  }
};